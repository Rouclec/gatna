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

  const userId = token.id;

  switch (req.method) {
    // Retrieve admin statistics
    case "GET":
      try {
        const withdrawals = await Withdrawal.find({
          user: userId,
        });

        return res.status(200).json({ data: withdrawals });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        return res.status(500).json({ message: "Error fetching admin stats." });
      }

    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
