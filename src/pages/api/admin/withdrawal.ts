import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/src/util/db";
import { Withdrawal } from "@/src/models";

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

  const isAdmin = token.role === "admin"; // Check if user is admin

  if (!isAdmin) {
    return res
      .status(403)
      .json({ message: "You do not have permission to perform this action" });
  }

  switch (req.method) {
    // Retrieve admin statistics
    case "GET":
      try {
        const withdrawals = await Withdrawal.find({
          status: "pending",
        });

        return res.status(200).json({ data: withdrawals });
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
        return res.status(500).json({ message: "Error fetching withdrawals." });
      }

    case "PUT":
      try {
        const { status, id } = req.body;
        const updatedWithdrawal = await Withdrawal.findByIdAndUpdate(
          id,
          {
            status,
          },
          { new: true }
        );

        return res.status(200).json({ data: updatedWithdrawal });
      } catch (error) {
        console.error("Error updating withdrawals:", error);
        return res.status(500).json({ message: "Error updating withdrawals." });
      }
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
