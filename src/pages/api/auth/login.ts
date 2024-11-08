import User from "@/src/models/User";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Role from "@/src/models/Role";
import dbConnect from "@/src/util/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // Ensure a connection to the database

  switch (req.method) {
    case "POST": // Handle POST request to login
      try {
        const { email, password } = req.body; // Extract email and password from request body

        const userFound = await User.findOne({ email }).select("+password");


        if (!(userFound && (await userFound.comparePassword(password)))) {
          //Check if a user exists with that email and if the password is correct
          return res
            .status(401)
            .json({ message: "Incorrect email and password combination" });
        }

        const user = await User.findByIdAndUpdate(userFound.id, {
          lastLogin: Date.now(),
        });

        return res.status(200).json({ data: user });
      } catch (error) {
        console.log({ error }, "in login");
        return res.status(500).json({ message: error });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["POST"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}
