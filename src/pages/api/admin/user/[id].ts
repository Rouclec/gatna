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

  const isAdmin = token.role === "admin"; // Check if user is admin

  if (!isAdmin) {
    return res
      .status(403)
      .json({ message: "You do not have permission to perform this action" });
  }

  switch (req.method) {
    case "DELETE":
      try {
        const { id } = req.query;

        const userFound = await User.findById(id);

        if (!userFound) {
          return res.status(404).json({
            message: `No user with id: ${id}`,
          });
        }

        await User.findByIdAndDelete(id);

        return res
          .status(200)
          .json({ data: `User with id ${id} deleted successfully` });
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["DELETE"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}