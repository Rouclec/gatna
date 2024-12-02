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
    case "GET": // Handle GET request to fetch all courses
      try {
        const { id } = req.query;

        const course = await Course.findById(id);

        if (!course) {
          return res
            .status(404)
            .json({ message: `Course with id ${id} not found` });
        }

        return res.status(200).json({ data: course });
      } catch (error) {
        return res.status(500).json({ message: error });
      }
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

        const { id } = req.query;

        const {
          package: pack,
          videoID,
          pdf,
          title,
          description,
          published,
        } = req.body; // Extract name from the request body

        const packageFound = await Package.findById(pack);

        if (!packageFound) {
          return res
            .status(400)
            .json({ message: `No package with id ${pack}` });
        }

        const videoAPIKeys = await VideoServer.findOne();

        if (!videoAPIKeys) {
          return res
            .status(404)
            .json({ message: `No video server data found on database` });
        }

        const decryptedPublicKey = videoAPIKeys.getDecryptedPublicKey();

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

          const course = await Course.findByIdAndUpdate(id, {
            package: pack,
            video: {
              id: videoResponse.data.id as string,
              length: videoResponse.data.length as number,
              title: title ?? (videoResponse.data.title as string),
              description:
                description ?? (videoResponse.data.description as string),
            },
            pdf: null,
            published,
          });

          return res.status(200).json({ data: course });
        } else {
          console.log({ title, description, pdf });
          const course = await Course.findByIdAndUpdate(id, {
            package: pack,
            pdf: {
              title: title,
              description: description,
              link: pdf,
            },
            video: null,
            published,
          });

          return res.status(200).json({ data: course });
        }
      } catch (error) {
        console.error({ error }, "updating course");
        return res.status(500).json({ message: error });
      }
    case "DELETE":
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

        const { id } = req.query;

        const existingCourse = await Course.findById(id);

        if (!existingCourse) {
          return res.status(400).json({ message: `No course with id ${id}` });
        }

        await Course.findByIdAndDelete(existingCourse._id);

        return res
          .status(200)
          .json({ message: `Course with id ${id} deleted successfully` });
      } catch (error) {
        console.error({ error }, "creating or updating");
        return res.status(500).json({ message: error });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["PUT", "DELETE"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}
