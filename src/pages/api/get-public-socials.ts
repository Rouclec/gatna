// pages/api/socials.ts

import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/src/util/db";
import { Socials } from "@/src/models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // Ensure database connection

  switch (req.method) {
    // Retrieve the user's socials
    case "GET":
      try {
        const socials = await Socials.findOne();

        if (!socials) {
          return res.status(404).json({ message: "Socials not found." });
        }

        return res.status(200).json({ data: socials });
      } catch (error) {
        console.error("Error fetching socials:", error);
        return res.status(500).json({ message: "Error fetching socials." });
      }

    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
