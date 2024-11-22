import dbConnect from "@/src/util/db";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { Coinpayment, Transaction, UserPackage } from "@/src/models";

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
        const coinPaymentInfo = await Coinpayment.findOne();

        if (!coinPaymentInfo) {
          return res
            .status(404)
            .json({ message: "No coinpayment info found on server" });
        }

        // Step 1: Retrieve IPN secret and HMAC from the request
        const ipnSecret = coinPaymentInfo.getDecryptedIpnSecret(); // Your secret from the CoinPayments dashboard
        const hmacHeader = req.headers["hmac"]; // HMAC signature from the request header

        if (!hmacHeader) {
          return res.status(400).json({ error: "HMAC header missing" });
        }

        // Step 2: Compute the HMAC using your IPN secret
        const requestBody = JSON.stringify(req.body);
        const computedHmac = crypto
          .createHmac("sha512", ipnSecret as string)
          .update(requestBody)
          .digest("hex");

        // Step 3: Compare the computed HMAC with the one sent by CoinPayments
        if (hmacHeader !== computedHmac) {
          return res.status(400).json({ error: "Invalid HMAC signature" });
        }

        // Step 2: Parse the IPN body
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

        const transaction = await Transaction.findOne({
          transactionId: txn_id,
        });

        if (!transaction) {
          return res.status(404).json({ error: "Transaction not found" });
        }

        const transactionStatus =
          TRANSACTION_STATUSES[
            (
              (status as number) ?? 0
            ).toString() as keyof typeof TRANSACTION_STATUSES
          ] || "failed";

        await Transaction.findByIdAndUpdate(transaction._id, {
          status: transactionStatus,
        });

        if (transactionStatus === "completed") {
          const userPackage = await UserPackage.findOne({
            user: transaction.user,
            package: transaction.package,
          });

          const today = new Date();
          const nextYear = new Date(today);
          nextYear.setFullYear(nextYear.getFullYear() + 1);

          console.log(`Today's date: ${today}`);
          console.log(`Date one year from today: ${nextYear}`);

          await UserPackage.findByIdAndUpdate(userPackage.id, {
            active: true,
            expiration: nextYear,
          });

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
