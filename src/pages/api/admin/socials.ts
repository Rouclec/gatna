// pages/api/socials.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/src/util/db";
import { Socials } from "@/src/models";

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

  const userId = token.id; // ID of the logged-in user
  const isAdmin = token.role === "admin"; // Check if user is admin

  if (!isAdmin) {
    return res
      .status(403)
      .json({ message: "You do not have permission to perform this action" });
  }

  switch (req.method) {
    // Create new socials entry for the user
    case "POST":
      try {
        const existingSocials = await Socials.findOne();
        if (existingSocials) {
          return res
            .status(400)
            .json({ message: "Socials record already exists" });
        }

        const { facebook, instagram, whatsapp, tiktok, otp, countryCode } =
          req.body;

        const newSocials = await Socials.create({
          facebook,
          instagram,
          whatsapp,
          tiktok,
          countryCode,
          otp,
          createdBy: userId,
        });

        return res.status(201).json({ data: newSocials });
      } catch (error) {
        console.error("Error creating socials:", error);
        return res.status(500).json({ message: "Error creating socials." });
      }

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

    // Update the user's socials
    case "PUT":
      try {
        const { facebook, instagram, whatsapp, tiktok, otp, countryCode } =
          req.body;

        const updatedSocials = await Socials.findOneAndUpdate(
          {},
          {
            facebook,
            instagram,
            whatsapp,
            tiktok,
            otp,
            countryCode,
            updatedBy: userId,
          },
          {
            new: true,
            runValidators: true,
          }
        );

        if (!updatedSocials) {
          return res.status(404).json({ message: "Socials not found." });
        }

        return res.status(200).json({ data: updatedSocials });
      } catch (error) {
        console.error("Error updating socials:", error);
        return res.status(500).json({ message: "Error updating socials." });
      }

    default:
      res.setHeader("Allow", ["POST", "GET", "PUT"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
