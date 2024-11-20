import { Category } from "@/src/models";

import dbConnect from "@/src/util/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // Ensure a connection to the database

  switch (req.method) {
    case "POST": // Handle POST request to create a new role
      try {
        const { name, tag, price, currency } = req.body; // Extract name from the request body
        const newCategory = new Category({ name, tag, price, currency }); // Create a new Role instance

        await newCategory.save(); // Save the new role to the database
        return res.status(201).json({ data: newCategory }); // Respond with the created role
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    case "GET":
      try {
        const categories = await Category.find().sort("name");

        return res.status(200).json({ data: categories });
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["POST", "GET"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}
