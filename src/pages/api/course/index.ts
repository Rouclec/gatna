import { Course, Package, VideoServer } from "@/src/models";

import dbConnect from "@/src/util/db";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // Ensure a connection to the database

  switch (req.method) {
    case "PUT": // Handle POST request to create a new role
      try {
        const token = await getToken({ req, secret });

        if (!token) {
          return res.status(401).json({
            message: "You must be logged in to access this resource.",
          });
        }

        const isAdmin = token.role === "admin"; // Check if user is admin

        if (!isAdmin) {
          return res.status(403).json({
            message: "You do not have permission to perform this action",
          });
        }

        const { package: pack, videoID, pdf, title, description } = req.body; // Extract name from the request body

        const packageFound = await Package.findById(pack);

        if (!packageFound) {
          return res
            .status(400)
            .json({ message: `No package with id ${pack}` });
        }

        const existingCourse = await Course.findOne({ package: pack });

        const videoAPIKeys = await VideoServer.findOne();

        if (!videoAPIKeys) {
          return res
            .status(404)
            .json({ message: `No video server data found on database` });
        }

        const decryptedPublicKey = videoAPIKeys.getDecryptedPublicKey();

        if (!existingCourse) {
          let videos:
            | {
                id: string;
                length: number;
                title: string;
                description: string;
              }[]
            | null = null;

          if (!!videoID) {
            const videoResponse = await axios.get(
              `${process.env.VIDEO_SERVER_API}/videos/${videoID}`,
              {
                headers: {
                  Authorization: `Apisecret ${decryptedPublicKey}`,
                },
              }
            );

            if (videoResponse.status !== 200) {
              return res
                .status(400)
                .json({ message: `Invalid video id: ${videoID}` });
            }
            videos = [
              {
                id: videoResponse.data.id as string,
                length: videoResponse.data.length as number,
                title: title ?? (videoResponse.data.title as string),
                description:
                  description ?? (videoResponse.data.description as string),
              },
            ];
          }

          const newCourse = new Course({
            package: pack,
            videos: videos,
            pdfs: !!pdf
              ? [
                  {
                    title,
                    description,
                    link: pdf,
                  },
                ]
              : null,
          });
          await newCourse.save();

          return res.status(201).json({ data: newCourse });
        } else {
          let videos = existingCourse.videos as
            | {
                id: string;
                length: number;
                title: string;
                description: string;
              }[]
            | null;

          let pdfs = existingCourse.pdfs as
            | {
                title: string;
                description: string;
                link: string;
              }[]
            | null;

          if (!!videoID) {
            const videoResponse = await axios.get(
              `${process.env.VIDEO_SERVER_API}/videos/${videoID}`,
              {
                headers: {
                  Authorization: `Apisecret ${decryptedPublicKey}`,
                },
              }
            );

            if (videoResponse.status !== 200) {
              return res
                .status(400)
                .json({ message: `Invalid video id: ${videoID}` });
            }

            // Check for duplicate video ID
            const isVideoDuplicate = (videos ?? []).some(
              (video: { id: string }) => video.id === videoResponse.data.id
            );

            if (!isVideoDuplicate && videoID) {
              if (Array.isArray(videos)) {
                videos.push({
                  id: videoResponse.data.id,
                  length: videoResponse.data.length,
                  title: title ?? videoResponse.data.title,
                  description: description ?? videoResponse.data.description,
                });
              } else {
                videos = [
                  {
                    id: videoResponse.data.id,
                    length: videoResponse.data.length,
                    title: title ?? videoResponse.data.title,
                    description: description ?? videoResponse.data.description,
                  },
                ];
              }
            } else if (isVideoDuplicate) {
              return res
                .status(400)
                .json({ message: "Video already exists in the course." });
            }
          }

          if (!!pdf) {
            if (Array.isArray(pdfs)) {
              pdfs.push({
                title,
                description,
                link: pdf,
              });
            } else {
              pdfs = [
                {
                  title,
                  description,
                  link: pdf,
                },
              ];
            }
          }

          const updatedCourse = await Course.findByIdAndUpdate(
            existingCourse._id,
            {
              videos,
              pdfs,
            },
            { new: true }
          );

          return res.status(200).json({ data: updatedCourse });
        }
      } catch (error) {
        console.error({ error }, "creating or updating");
        return res.status(500).json({ message: error });
      }
    case "GET":
      try {
        const courses = await Course.aggregate([
          {
            $lookup: {
              from: "packages", // Name of the Package collection
              localField: "package", // Field in the Course collection
              foreignField: "_id", // Field in the Package collection
              as: "packageDetails", // Resulting field name
            },
          },
          {
            $unwind: "$packageDetails", // Decompose the packageDetails array for sorting
          },
          {
            $sort: { "packageDetails.price": 1 }, // Sort by package price (ascending)
          },
          {
            $project: {
              // Include all fields from Course and packageDetails
              _id: 1,
              videos: 1,
              pdfs: 1,
              duration: 1,
              published: 1,
              createdAt: 1,
              updatedAt: 1,
              package: "$packageDetails", // Embed full package details
            },
          },
        ]);

        return res.status(200).json({ data: courses });
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["PUT", "GET"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}
