import { Notification } from "@/src/models";
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
    case "POST": {
      // Mark notifications as read
      try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids)) {
          return res.status(400).json({ message: "Invalid input. Provide an array of IDs." });
        }

        // Update the read field for all notifications with matching IDs
        const result = await Notification.updateMany(
          { _id: { $in: ids } },
          { $set: { read: true } }
        );

        return res.status(200).json({
          message: `${result.modifiedCount} notifications marked as read.`,
        });
      } catch (error) {
        console.error("Error updating notifications:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    }

    default: {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
}
