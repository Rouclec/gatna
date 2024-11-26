// pages/api/admin/stats.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/src/util/db";
import { User, UserPackage, Course, Transaction } from "@/src/models";

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

        // 1. Total users
        const totalUsers = await User.countDocuments();

        // 2. Total subscribers
        const totalSubscribers = await UserPackage.countDocuments({
          active: true,
        });

        // 3. Total videos
        const totalVideos = await Course.aggregate([
          { $unwind: "$videos" }, // Flatten the videos array
          { $count: "totalVideos" }, // Count the total number of videos
        ]);
        const videosCount =
          totalVideos.length > 0 ? totalVideos[0].totalVideos : 0;

        // 4. Pending requests
        const pendingRequests = await Transaction.countDocuments({
          status: "pending",
        });

        // 5. Total sales
        const totalSalesData = await Transaction.aggregate([
          { $match: { status: "completed" } }, // Match only completed transactions
          { $group: { _id: null, totalAmount: { $sum: "$amount" } } }, // Sum up the amounts
        ]);
        const totalSales =
          totalSalesData.length > 0 ? totalSalesData[0].totalAmount : 0;

        // Return the stats
        return res.status(200).json({
          data: {
            users: totalUsers,
            subscribers: totalSubscribers,
            videos: videosCount,
            pendingRequests,
            sales: totalSales,
          },
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        return res.status(500).json({ message: "Error fetching admin stats." });
      }

    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
