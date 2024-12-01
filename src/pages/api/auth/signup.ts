import { Role, User } from "@/src/models";
import dbConnect from "@/src/util/db";
import generateRandomPassword from "@/src/util/password";
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
          referred_by,
          country_code,
        } = req.body; // Extract values from request body

        const role = await Role.findOne({ code: "user" });

        let setPassword = password;

        if (!!setPassword) {
          if (password !== confirm_password) {
            return res.status(400).json({
              message: "Password and confirm password does not match",
            });
          }
        } else {
          setPassword = generateRandomPassword(16);
        }

        const newUser = new User({
          firstName: first_name,
          lastName: last_name,
          email,
          password: setPassword,
          phoneNumber: phone_number,
          role: role?.id,
          referredBy: referred_by,
          countryCode: country_code,
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
