import { User } from "@/src/models";
import dbConnect from "@/src/util/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

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
    case "GET":
      try {
        const userFound = await User.findById(userId);

        if (!userFound) {
          return res.status(404).json({
            message: `No user with id: ${userId}`,
          });
        }

        return res.status(200).json({ data: userFound });
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    case "PUT":
      try {
        const {
          firstName,
          lastName,
          countryCode,
          phoneNumber,
          walletId,
          profilePic,
        } = req.body;

        const user = await User.findByIdAndUpdate(
          userId,
          {
            firstName,
            lastName,
            countryCode,
            phoneNumber,
            walletId,
            profilePic,
          },
          { new: true }
        );

        return res.status(200).json({ data: user });
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["GET", "PUT"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}
