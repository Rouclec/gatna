import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/src/util/db";
import { Account } from "@/src/models";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // Ensure database connection

  // Fallback to getToken if session is initially null
  const token = await getToken({ req, secret });

  if (!token) {
    return res
      .status(401)
      .json({ message: "You must be logged in to access this resource." });
  }


  const userId = token.id; // ID of the logged-in user
  const isAdmin = token.role === "admin"; // Check if user is admin

  if (!isAdmin) {
    return res
      .status(403)
      .json({ message: "You do not have permission to perform this action" });
  }

  switch (req.method) {
    // Create a new Account for the authenticated user
    case "POST":
      try {
        // Check if the user already has an account
        const existingAccount = await Account.findOne({ userId });
        if (existingAccount) {
          return res
            .status(400)
            .json({ message: "You already have an account." });
        }

        const {
          companyName,
          minimumWithdrawalAmount,
          email,
          walletId,
          telephone,
          otp,
          countryCode,
        } = req.body;

        // Create a new account with the user's ID
        const newAccount = await Account.create({
          userId,
          companyName,
          minimumWithdrawalAmount,
          email,
          walletId,
          telephone,
          otp,
          countryCode,
        });

        return res.status(201).json({ data: newAccount });
      } catch (error) {
        console.error("Error creating account:", error);
        return res.status(500).json({ message: "Error creating account." });
      }

    // Retrieve the authenticated user's account
    case "GET":
      try {
        const account = await Account.findOne({ userId });

        if (!account) {
          return res.status(404).json({ message: "Account not found." });
        }

        return res.status(200).json({ data: account });
      } catch (error) {
        console.error("Error fetching account:", error);
        return res.status(500).json({ message: "Error fetching account." });
      }

    // Update the authenticated user's account
    case "PUT":
      try {
        const {
          companyName,
          minimumWithdrawalAmount,
          email,
          walletId,
          telephone,
          otp,
          countryCode,
        } = req.body;

        const updatedAccount = await Account.findOneAndUpdate(
          { userId },
          {
            companyName,
            minimumWithdrawalAmount,
            email,
            walletId,
            telephone,
            otp,
            countryCode,
          },
          {
            new: true, // Return the updated document
            runValidators: true, // Ensure schema validation rules are applied
          }
        );

        if (!updatedAccount) {
          return res.status(404).json({ message: "Account not found." });
        }

        return res.status(200).json({ data: updatedAccount });
      } catch (error) {
        console.error("Error updating account:", error);
        return res.status(500).json({ message: "Error updating account." });
      }

    default:
      res.setHeader("Allow", ["POST", "GET", "PUT"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
