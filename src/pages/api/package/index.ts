import { Package, VideoServer } from "@/src/models";

import dbConnect from "@/src/util/db";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // Ensure a connection to the database

  switch (req.method) {
    case "POST": // Handle POST request to create a new role
      try {
        const videoAPIKeys = await VideoServer.findOne();

        if (!videoAPIKeys) {
          return res
            .status(404)
            .json({ message: `No video server data found on database` });
        }

        const decryptedPublicKey = videoAPIKeys.getDecryptedPublicKey();

        const { name, tag, price, currency, previewVideo, parent } = req.body; // Extract name from the request body

        const videoResponse = await axios.get(
          `${process.env.VIDEO_SERVER_API}/videos/${previewVideo.id}`,
          {
            headers: {
              Authorization: `Apisecret ${decryptedPublicKey}`,
            },
          }
        );

        if (videoResponse.status !== 200) {
          return res
            .status(400)
            .json({ message: `Invalid video id: ${previewVideo.id}` });
        }

        const newPackage = new Package({
          name,
          tag,
          price,
          parent,
          currency,
          previewVideo: {
            id: previewVideo.id,
            length: videoResponse.data.length as number,
            title: previewVideo?.title ?? (videoResponse.data.title as string),
            description:
              previewVideo?.description ??
              (videoResponse.data.description as string),
          },
        }); // Create a new Role instance

        await newPackage.save(); // Save the new role to the database
        return res.status(201).json({ data: newPackage }); // Respond with the created role
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    case "GET":
      try {
        const packages = await Package.aggregate([
          {
            // Lookup courses related to each package
            $lookup: {
              from: "courses", // The name of the 'courses' collection
              localField: "_id", // Field in the 'packages' collection
              foreignField: "package", // Field in the 'courses' collection
              as: "courses", // The resulting field containing the matched courses
            },
          },
          {
            // Add fields for the computed statistics
            $addFields: {
              totalVideos: {
                $size: {
                  $filter: {
                    input: "$courses",
                    as: "course",
                    cond: { $ne: ["$$course.video", null] }, // Check if 'video' field is not null
                  },
                },
              },
              totalPDFs: {
                $size: {
                  $filter: {
                    input: "$courses",
                    as: "course",
                    cond: { $ne: ["$$course.pdf", null] }, // Check if 'pdf' field is not null
                  },
                },
              },
              totalDuration: {
                $sum: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$courses", // Filter courses with non-null 'video'
                        as: "course",
                        cond: { $ne: ["$$course.video", null] },
                      },
                    },
                    as: "course",
                    in: "$$course.video.length", // Access the 'length' field in the 'video' object
                  },
                },
              },
            },
          },
          {
            // Exclude the 'courses' field if not needed in the response
            $project: {
              courses: 0,
            },
          },
          {
            // Sort packages by price in ascending order
            $sort: {
              price: 1, // 1 for ascending order, -1 for descending order
            },
          },
        ]);

        // console.log(packages);

        return res.status(200).json({ data: packages });
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["POST", "GET"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}
