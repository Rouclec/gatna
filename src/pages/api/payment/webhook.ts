import dbConnect from "@/src/util/db";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import {
  Coinpayment,
  Notification,
  Transaction,
  User,
  UserPackage,
} from "@/src/models";
import generateRandomPassword from "@/src/util/password";
import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";

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
  await dbConnect(); // Ensure database connection

  switch (req.method) {
    case "POST": // Handle POST request to login
      try {
        //Step 0: Setup email sender;
        const mailerSend = new MailerSend({
          apiKey: process.env.MAIL_API_KEY as string,
        });

        const sentFrom = new Sender(
          process.env.EMAIL_FROM as string,
          "Gatna.io"
        );

        const coinPaymentInfo = await Coinpayment.findOne();

        if (!coinPaymentInfo) {
          return res
            .status(404)
            .json({ message: "No coinpayment info found on server" });
        }

        // Step 1: Retrieve IPN secret and HMAC from the request
        const ipnSecret = coinPaymentInfo.getDecryptedIpnSecret(); // Your secret from the CoinPayments dashboard
        const hmacHeader = req.headers["hmac"]; // HMAC signature from the request header

        console.log({ ipnSecret });
        console.log({ hmacHeader });

        if (!hmacHeader) {
          return res.status(400).json({ error: "HMAC header missing" });
        }

        // Step 2: Compute the HMAC using your IPN secret
        const requestBody = JSON.stringify(req.body);

        console.log({ requestBody });

        const computedHmac = crypto
          .createHmac("sha512", ipnSecret as string)
          .update(requestBody)
          .digest("hex");

        console.log({ computedHmac });
        // Step 3: Compare the computed HMAC with the one sent by CoinPayments
        if (hmacHeader !== computedHmac) {
          return res.status(400).json({ error: "Invalid HMAC signature" });
        }

        // Step 4: Parse the IPN body
        const {
          txn_id,
          status,
          status_text,
          //   amount1,
          //   currency1,
          //   amount2,
          //   currency2,
          //   custom,
          //   address,
          //   confirms,
        } = req.body;

        //Step 5: Find the transaction with that id
        const transaction = await Transaction.findOne({
          transactionId: txn_id,
        });

        console.log({ transaction });

        if (!transaction) {
          return res.status(404).json({ error: "Transaction not found" });
        }

        //Step 6: Find the user
        const userFound = await User.findById(transaction.user);

        if (!userFound) {
          return res.status(404).json({
            message: `No user found for this transaction with id: ${transaction.user}`,
          });
        }

        console.log({ userFound });

        //Step 7: Check the transaction status
        const transactionStatus =
          TRANSACTION_STATUSES[
            (
              (status as number) ?? 0
            ).toString() as keyof typeof TRANSACTION_STATUSES
          ] || "failed";

        console.log({ transactionStatus });

        await Transaction.findByIdAndUpdate(transaction._id, {
          status: transactionStatus,
        });

        if (transactionStatus === "completed") {
          const userPackage = await UserPackage.findOne({
            user: transaction.user,
            package: transaction.package,
          }).populate("package");

          const today = new Date();
          const nextYear = new Date(today);
          nextYear.setFullYear(nextYear.getFullYear() + 1);

          console.log(`Today's date: ${today}`);
          console.log(`Date one year from today: ${nextYear}`);

          const newPassword = generateRandomPassword(10);

          await User.findByIdAndUpdate(userFound._id, {
            password: newPassword,
          });

          await UserPackage.findByIdAndUpdate(userPackage.id, {
            active: true,
            expiration: nextYear,
          });

          const recipients = [
            new Recipient(userFound.email, userFound.firstName),
          ];

          const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setReplyTo(sentFrom)
            .setSubject("Welcome to Gatna.io")
            .setHtml(
              `<p>Welcome to gatna.io <br /> Your password is <strong>${newPassword}</strong>.<br />Feel free to change the password in the settings section of your account</p>`
            )
            .setText("Welcome to Gatna.io");

          await mailerSend.email.send(emailParams);

          const notification = new Notification({
            title: `Payment completed`,
            body: `${userFound?.email} has completed payment for the package ${userPackage.package.name}`,
          });

          await notification.save();

          res.status(200).json({ message: "IPN validated successfully" });
        } else {
          return res.status(200).json({
            message: `Transaction failed with status: ${status_text}`,
          });
        }
      } catch (error) {
        console.error("Error validating IPN:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["POST"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}
