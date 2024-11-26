import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/src/util/db";
import { VideoServer } from "@/src/models";
import axios from "axios";

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

  switch (req.method) {
    case "GET":
      try {
        const videoAPIKeys = await VideoServer.findOne();

        const decryptedPublicKey = videoAPIKeys.getDecryptedPublicKey();

        const courses = await axios.get(
          `${process.env.VIDEO_SERVER_API}/videos/folders/root`,
          {
            headers: {
              Authorization: `Apisecret ${decryptedPublicKey}`,
            },
          }
        );

        return res.status(200).json({ data: courses.data.folderList });
      } catch (error) {
        console.error("Error fetching courses:", error);
        return res.status(500).json({ message: "Error fetching courses." });
      }

    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
