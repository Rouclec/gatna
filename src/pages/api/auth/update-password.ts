import { Role, User } from "@/src/models";

import dbConnect from "@/src/util/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // Ensure a connection to the database
  // Ensure Role model is loaded by calling a dummy check to register schema
  await Role.exists({});

  const token = await getToken({ req, secret });

  if (!token) {
    return res
      .status(401)
      .json({ message: "You must be logged in to access this resource." });
  }

  const userId = token.id; // ID of the logged-in user

  switch (req.method) {
    case "POST":
      try {
        const { oldPassword, newPassword, confirmNewPassword } = req.body; // Extract email and password from request body

        const userFound = await User.findById(userId).select("+password");

        if (!userFound) {
          //Check if a user exists with that email and if the password is correct
          return res
            .status(404)
            .json({ message: "Incorrect email and password combination" });
        }

        const passwordMatch = await userFound.comparePassword(oldPassword);
        if (!passwordMatch) {
          //Check if a user exists with that email and if the password is correct
          return res.status(500).json({ message: "Old password is incorrect" });
        }

        if (newPassword !== confirmNewPassword) {
          return res.status(403).json({
            message: "New password and confirm new password do not match",
          });
        }

        await User.findByIdAndUpdate(userFound.id, {
          password: newPassword,
        });

        return res.status(200).json({ message: "Password updated" });
      } catch (error) {
        console.log({ error }, "updating password");
        return res.status(500).json({ message: error });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["POST"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}
