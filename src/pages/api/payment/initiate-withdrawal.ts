import dbConnect from "@/src/util/db";
import { NextApiRequest, NextApiResponse } from "next";
import Coinpayments from "coinpayments";
import { Coinpayment, Notification, Transaction, User } from "@/src/models";
import { getToken } from "next-auth/jwt";
import { verifyEntityOTP } from "@/src/util/otp";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // Ensure database connection

  const token = await getToken({ req, secret });

  if (!token) {
    return res
      .status(401)
      .json({ message: "You must be logged in to access this resource." });
  }

  const userId = token.id; // ID of the logged-in user

  switch (req.method) {
    case "POST": // Handle POST request to login
      try {
        const protocol = req.headers["x-forwarded-proto"] || "https"; // Use "https" in production
        const host = req.headers.host; // Get the host (e.g., localhost:3000 or my-domain.com)
        const ipn_url = `${protocol}://${host}/api/hello`;

        const { amount, walletId, password, pin, otp } = req.body;

        const validOTP = await verifyEntityOTP(User, otp, userId as string);
        if (!validOTP) {
          return res.status(400).json({ message: "Invalid otp" });
        }

        const userFound = await User.findById(userId).select(
          "+password +withdrawalPin"
        );


        if (!userFound || !userFound.active) {
          //Check if a user exists with that email and if the password is correct
          return res
            .status(404)
            .json({ message: `No active user found with id: ${userId}` });
        }

        const passwordMatch = await userFound.comparePassword(password);
        if (!passwordMatch) {
          //Check if a user exists with that email and if the password is correct
          return res.status(500).json({ message: "Incorrect password" });
        }

        const pinMatch = await userFound.compareWithdrawalPin(pin);

        if (!pinMatch) {
          return res.status(500).json({ message: "Incorrect pin" });
        }

        const coinPaymentInfo = await Coinpayment.findOne();

        if (!coinPaymentInfo) {
          return res
            .status(404)
            .json({ message: "No coinpayment info found on server" });
        }

        const coinpaymentsClient = new Coinpayments({
          key: coinPaymentInfo.getDecryptedPrivateKey() as string,
          secret: coinPaymentInfo.getDecryptedSecretKey() as string,
        });

        if (userFound?.walletBalance < amount) {
          return res.status(500).json({ message: "Insufficient balance" });
        }

        const transaction = await coinpaymentsClient.createWithdrawal({
          currency: "USDT.TRC20",
          currency2: "USD",
          // amount: Package.price, //TODO: revert this to use the Package's price
          amount: 1,
          address: walletId,
          ipn_url,
        });

        const dbTransaction = new Transaction({
          transactionId: transaction.id,
          package: null,
          user: userId,
          amount: amount,
          currency1: "USDT.TRC20",
          type: "withdrawal",
        });

        const notification = new Notification({
          title: `Withdrawal request`,
          body: `${userFound?.email} has requested a withdrawal of ${amount}`,
        });

        await notification.save();

        await dbTransaction.save();

        return res.status(200).json({ data: transaction });
      } catch (error) {
        console.error( error , "initiating withdrawal");
        return res.status(500).json({ message: error });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["POST"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}
