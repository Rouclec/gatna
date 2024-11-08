import Role from "@/src/models/Role";
import User from "@/src/models/User";
import dbConnect from "@/src/util/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // Ensure a connection to the database

  switch (req.method) {
    case "POST": // Handle POST request to create a new user
      try {
        const {
          first_name,
          last_name,
          email,
          password,
          confirm_password,
          phone_number,
        } = req.body; // Extract values from request body

        const role = await Role.findOne({ code: "user" });

        if (password !== confirm_password) {
          return res
            .status(400)
            .json({ message: "Password and confirm password does not match" });
        }

        const newUser = new User({
          firstName: first_name,
          lastName: last_name,
          email,
          password,
          phoneNumber: phone_number,
          role: role?.id,
        });

        await newUser.save();

        // Convert to plain object and omit the password
        const userWithoutPassword = newUser.toObject();
        delete userWithoutPassword.password;

        return res.status(201).json({ data: userWithoutPassword });
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["POST"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}
