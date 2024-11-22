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
    case "GET": // Handle POST request to create a new role
      try {
        const { id } = req.query;

        const pack = await Package.findById(id);

        if (!pack) {
          return res
            .status(404)
            .json({ message: `Package with id ${id} not found` });
        }
        return res.status(200).json({ data: pack }); // Respond with the created role
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    case "PUT": // Handle GET request to fetch all roles
      try {
        const { id } = req.query;
        const { name, tag, price, parent, currency, previewVideo } =
          await req.body;

        const videoAPIKeys = await VideoServer.findOne();

        if (!videoAPIKeys) {
          return res
            .status(404)
            .json({ message: `No video server data found on database` });
        }

        const decryptedPublicKey = videoAPIKeys.getDecryptedPublicKey();

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

        const pack = await Package.findByIdAndUpdate(
          id,
          { name, tag, price, parent, currency, previewVideo },
          { new: true }
        );

        if (!pack) {
          return res
            .status(404)
            .json({ message: `Package with id ${id} not found` });
        }

        return res.status(200).json({ data: pack });
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    case "DELETE":
      try {
        await dbConnect();

        const { id } = req.query;
        const pack = await Package.findByIdAndDelete(id);

        if (!pack) {
          res.status(404).json({ error: `Package with id ${id} not found` });
        }

        return res.status(200);
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}
