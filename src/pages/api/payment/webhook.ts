import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import dbConnect from "@/src/util/db";
import {
  Coinpayment,
  Transaction,
  User,
  UserPackage,
  Notification,
} from "@/src/models";
import generateRandomPassword from "@/src/util/password";
import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";
import { IncomingMessage } from "http";

// Transaction status mappings
const TRANSACTION_STATUSES = {
  "0": "pending",
  "-1": "failed",
  "1": "completed",
  "100": "completed",
} as const;

// Disable automatic body parsing for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Helper function to capture raw request body
 */
async function getRawBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await dbConnect(); // Connect to the database

  try {
    // Step 1: Get the raw request body
    const rawBody = await getRawBody(req);
    const hmacHeader = req.headers["hmac"] as string;

    if (!hmacHeader) {
      return res.status(400).json({ error: "HMAC header missing" });
    }

    console.log({ hmacHeader });

    // Step 2: Fetch the IPN secret from the database
    const coinPaymentInfo = await Coinpayment.findOne();

    if (!coinPaymentInfo) {
      return res
        .status(404)
        .json({ message: "No CoinPayment info found on server" });
    }

    const ipnSecret = coinPaymentInfo.getDecryptedIpnSecret();

    // Step 3: Compute the HMAC using the raw body
    const computedHmac = crypto
      .createHmac("sha512", ipnSecret)
      .update(rawBody)
      .digest("hex");

    console.log({ computedHmac });
    // Step 4: Validate the HMAC
    if (hmacHeader !== computedHmac) {
      return res.status(400).json({ error: "Invalid HMAC signature" });
    }

    // Step 5: Parse the raw body into JSON
    const { txn_id, status, status_text } = req.body;

    // Step 6: Find the corresponding transaction
    const transaction = await Transaction.findOne({ transactionId: txn_id });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Step 7: Find the user associated with the transaction
    const userFound = await User.findById(transaction.user);

    if (!userFound) {
      return res.status(404).json({
        message: `No user found for this transaction with id: ${transaction.user}`,
      });
    }

    // Step 8: Determine the transaction status
    const transactionStatus =
      TRANSACTION_STATUSES[
        (status?.toString() as keyof typeof TRANSACTION_STATUSES) ?? "0"
      ] || "failed";

    // Update the transaction status in the database
    await Transaction.findByIdAndUpdate(transaction._id, {
      status: transactionStatus,
    });

    // Step 9: Handle completed transactions
    if (transactionStatus === "completed") {
      const userPackage = await UserPackage.findOne({
        user: transaction.user,
        package: transaction.package,
      }).populate("package");

      const today = new Date();
      const nextYear = new Date(today);
      nextYear.setFullYear(nextYear.getFullYear() + 1);

      const newPassword = generateRandomPassword(10);

      // Update user's password
      await User.findByIdAndUpdate(userFound._id, {
        password: newPassword,
      });

      // Activate the user's package and set the expiration date
      await UserPackage.findByIdAndUpdate(userPackage?.id, {
        active: true,
        expiration: nextYear,
      });

      // Send confirmation email to the user
      const mailerSend = new MailerSend({
        apiKey: process.env.MAIL_API_KEY as string,
      });

      const sentFrom = new Sender(process.env.EMAIL_FROM as string, "Gatna.io");

      const recipients = [new Recipient(userFound.email, userFound.firstName)];

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject("Welcome to Gatna.io")
        .setHtml(
          `<p>Welcome to Gatna.io <br /> Your password is <strong>${newPassword}</strong>.<br />Feel free to change the password in the settings section of your account</p>`
        )
        .setText("Welcome to Gatna.io");

      await mailerSend.email.send(emailParams);

      // Save a notification for the admin
      const notification = new Notification({
        title: `Payment completed`,
        body: `${userFound?.email} has completed payment for the package ${userPackage?.package?.name}`,
      });

      await notification.save();

      res
        .status(200)
        .json({ message: "IPN validated and processed successfully" });
    } else {
      res.status(200).json({
        message: `Transaction failed with status: ${status_text}`,
      });
    }
  } catch (error) {
    console.error("Error validating IPN:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
