import { Transaction, UserPackage } from "@/src/models";
import dbConnect from "@/src/util/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // Ensure a connection to the database

  const token = await getToken({ req, secret });

  if (!token) {
    return res
      .status(401)
      .json({ message: "You must be logged in to access this resource." });
  }

  const isAdmin = token.role === "admin"; // Check if user is admin

  if (!isAdmin) {
    return res
      .status(403)
      .json({ message: "You do not have permission to perform this action" });
  }

  switch (req.method) {
    case "GET":
      try {
        // Fetch all transactions and populate user and package
        const transactions = await Transaction.find()
          .populate("package")
          .populate("user")
          .sort("-createdAt");

        // Filter out transactions where user or package is null
        const validTransactions = transactions.filter(
          (transaction) => transaction.user && transaction.package
        );

        // Attach expiryDate to each valid transaction
        const transactionsWithExpiry = await Promise.all(
          validTransactions.map(async (transaction) => {
            // Find the UserPackage for this user and package
            const userCourse = await UserPackage.findOne({
              user: transaction.user._id, // Match user ID
              package: transaction.package._id, // Match package ID
            });

            // Extract expiryDate (if it exists) or set it to null
            const expiryDate = userCourse?.expiration || null;

            // Return the transaction with the expiryDate attached
            return {
              ...transaction.toObject(), // Convert Mongoose document to plain JS object
              expiryDate, // Add expiryDate to the response
            };
          })
        );

        return res.status(200).json({ data: transactionsWithExpiry });
      } catch (error) {
        console.error("Error fetching transactions:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
