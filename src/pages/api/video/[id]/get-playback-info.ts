import { VideoServer } from "@/src/models";
import dbConnect from "@/src/util/db";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // Ensure a connection to the database

  switch (req.method) {
    case "GET": // Handle GET request to fetch all courses
      try {
        const { id } = req.query;

        const videoAPIKeys = await VideoServer.findOne();

        const decryptedPublicKey = videoAPIKeys.getDecryptedPublicKey();

        const videoResponse = await axios.get(
          `${process.env.VIDEO_SERVER_API}/videos/${id}/otp`,
          {
            headers: {
              Authorization: `Apisecret ${decryptedPublicKey}`,
            },
          }
        );

        if (videoResponse.status !== 200) {
          return res.status(400).json({ message: `Invalid video id: ${id}` });
        }

        return res.status(200).json({ data: videoResponse.data });
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["GET"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}
