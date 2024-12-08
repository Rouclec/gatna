import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/src/util/db";
import {
  Coinpayment,
  Transaction,
  User,
  UserPackage,
  Notification,
} from "@/src/models";
import generateRandomPassword from "@/src/util/password";
import { sendEmailViaSMTP } from "@/src/util/email";

// Transaction status mappings
const TRANSACTION_STATUSES = {
  "0": "pending",
  "-1": "failed",
  "1": "completed",
  "100": "completed",
} as const;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const host = req.headers.host; // Get the host (e.g., localhost:3000 or my-domain.com)

  if (host !== "localhost:3000" && host !== "dev.gatna.io"){
    return res.status(500).json({ message: "Invalid request" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    console.log("Invalid request method");
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await dbConnect();
  console.log("Database connected");

  try {
    const coinPaymentInfo = await Coinpayment.findOne();
    if (!coinPaymentInfo) {
      console.log("No CoinPayment info found");
      return res
        .status(404)
        .json({ message: "No CoinPayment info found on server" });
    }
    console.log("CoinPayment info retrieved:", coinPaymentInfo);

    const ipnSecret = coinPaymentInfo.getDecryptedIpnSecret();
    console.log("Decrypted IPN secret:", ipnSecret);

    const { txn_id, status, status_text } = req.body;

    console.log("Finding transaction with ID:", txn_id);
    const transaction = await Transaction.findOne({ transactionId: txn_id });
    if (!transaction) {
      console.log("Transaction not found");
      return res.status(404).json({ error: "Transaction not found" });
    }
    console.log("Transaction found:", transaction);

    if (transaction.status === "completed") {
      return res
        .status(200)
        .json({ message: "Transaction already completed!" });
    }

    console.log("Finding user associated with transaction...");
    const userFound = await User.findById(transaction.user);
    if (!userFound) {
      console.log(
        `No user found for transaction with user ID: ${transaction.user}`
      );
      return res.status(404).json({
        message: `No user found for this transaction with id: ${transaction.user}`,
      });
    }

    const transactionStatus =
      TRANSACTION_STATUSES[status as keyof typeof TRANSACTION_STATUSES] ||
      "failed";
    console.log("Transaction status determined:", transactionStatus);

    console.log("Updating transaction status...");
    await Transaction.findByIdAndUpdate(transaction._id, {
      status: transactionStatus,
    });

    if (transactionStatus === "completed") {
      console.log("Handling completed transaction...");
      const userPackage = await UserPackage.findOne({
        user: transaction.user,
        package: transaction.package,
      }).populate("package");
      console.log("User package found:", userPackage);

      const today = new Date();
      const nextYear = new Date(today);
      nextYear.setFullYear(nextYear.getFullYear() + 1);

      console.log("Generating new password...");
      const newPassword = generateRandomPassword(10);

      console.log("Updating user password...");
      await User.findByIdAndUpdate(userFound._id, {
        password: newPassword,
        active: true,
      });

      console.log("Activating user package...");
      await UserPackage.findByIdAndUpdate(userPackage?.id, {
        active: true,
        expiration: nextYear,
      });

      await User.findOneAndUpdate(
        { referalCode: userFound.referredBy },
        { $inc: { walletBalance: 10 } }, // Increment wallet balance by 10
        { new: true } // Return the updated document
      );

      console.log("Sending confirmation email...");

      const protocol = req.headers["x-forwarded-proto"] || "https"; // Use "https" in production
      const signin_url = `${protocol}://${host}/signin?email=${userFound.email}`;

      await sendEmailViaSMTP({
        to: userFound.email,
        subject: "Welcome to Gatna.io",
        body: `<p>Welcome to Gatna.io <br /> Your password is <strong>${newPassword}</strong>. <a href=${signin_url}>Login here</a><br />Feel free to change the password in the settings section of your account</p>`,
      });

      console.log("Confirmation email sent");

      console.log("Saving notification...");
      const notification = new Notification({
        title: `Payment completed`,
        body: `${userFound?.email} has completed payment for the package ${userPackage?.package?.name}`,
      });

      await notification.save();
      console.log("Notification saved");

      res
        .status(200)
        .json({ message: "IPN validated and processed successfully" });
    } else {
      console.log(`Transaction failed with status: ${status_text}`);
      res.status(200).json({
        message: `Transaction failed with status: ${status_text}`,
      });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
