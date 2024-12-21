import { Course, Package, UserPackage } from "@/src/models";
import dbConnect from "@/src/util/db";
import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";

async function getAllSubPackages(packageId: string) {
  const packages = await Package.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(packageId) }, // Start with the user's package
    },
    {
      $graphLookup: {
        from: "packages", // Collection name
        startWith: "$_id",
        connectFromField: "_id",
        connectToField: "parent",
        as: "descendants",
      },
    },
    {
      $project: {
        allPackages: {
          $concatArrays: [["$_id"], "$descendants._id"], // Combine parent with descendants
        },
      },
    },
  ]);

  return packages.length > 0 ? packages[0].allPackages : [];
}

async function getCoursesForUser(userId: string, packageId: string) {
  // Step 1: Get all packages (including children)
  const allPackageIds = await getAllSubPackages(packageId);

  // Step 2: Fetch all courses for these packages
  const courses = await Course.find({
    package: { $in: allPackageIds }, // Match any of the retrieved package IDs
    published: true, // Only fetch active courses
  }).populate("package"); // Optional: populate the package details

  return courses;
}

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

  const userId = token.id; // ID of the logged-in user

  switch (req.method) {
    case "GET": // Handle GET request to fetch all courses
      try {
        // Current date
        const now = new Date();

        // Query
        const query = {
          user: userId,
          active: true,
          expiration: { $gt: now },
        };

        const userPackage = await UserPackage.findOne(query).sort("-createdAt");

        if (!userPackage) {
          return res.status(404).json({
            message: `No active package found for user with id: ${userId}`,
          });
        }

        const packageFound = await Package.findById(userPackage.package);

        if (!packageFound) {
          return res.status(404).json({
            message: `No package found with id: ${userPackage.package}`,
          });
        }

        const userCourses = await getCoursesForUser(
          userId as string,
          packageFound._id
        );

        return res.status(200).json({ data: userCourses });
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["GET"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}
