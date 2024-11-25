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
    case "GET": // Handle GET request to fetch notifications, with optional filtering
      try {
        const notifications = await Notification.find().sort("read"); // Fetch notifications based on the filter
        return res.status(200).json({ data: notifications }); // Respond with the filtered list of notifications
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["GET", "POST"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}
