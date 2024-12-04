import dbConnect from "@/src/util/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Account, Notification, User, Withdrawal } from "@/src/models";
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

        const adminInfo = await Account.findOne();

        if (
          adminInfo &&
          adminInfo.minimumWithdrawalAmount &&
          adminInfo.minimumWithdrawalAmount > amount
        ) {
          return res
            .status(403)
            .json({
              message: `Minimum withdrawal amount is $${adminInfo.minimumWithdrawalAmount}`,
            });
        }

        if (userFound?.walletBalance < amount) {
          return res.status(500).json({ message: "Insufficient balance" });
        }

        const dbWithdrawal = new Withdrawal({
          user: userId,
          amount: amount,
          walletId,
          currency: "USDT.TRC20",
          type: "withdrawal",
        });

        await User.findByIdAndUpdate(
          userId,
          { $inc: { walletBalance: -amount } }, // Decrement the user's wallet balance by 10
          { new: true } // Return the updated document
        );

        const notification = new Notification({
          title: `Withdrawal request`,
          body: `${userFound?.email} has requested a withdrawal of ${amount}`,
        });

        await notification.save();

        await dbWithdrawal.save();

        return res.status(200).json({ data: dbWithdrawal });
      } catch (error) {
        console.error(error, "initiating withdrawal");
        return res.status(500).json({ message: error });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["POST"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}
