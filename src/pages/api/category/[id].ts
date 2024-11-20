import { Category } from "@/src/models";

import dbConnect from "@/src/util/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // Ensure a connection to the database

  switch (req.method) {
    case "GET": // Handle POST request to create a new role
      try {
        const { id } = req.query;

        const category = await Category.findById(id);

        if (!category) {
          return res
            .status(404)
            .json({ message: `Category with id ${id} not found` });
        }
        return res.status(200).json({ data: category }); // Respond with the created role
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    case "PUT": // Handle GET request to fetch all roles
      try {
        const { id } = req.query;
        const { name, tag } = await req.body;
        const category = await Category.findByIdAndUpdate(
          id,
          { name, tag },
          { new: true }
        );

        if (!category) {
          return res
            .status(404)
            .json({ message: `Category with id ${id} not found` });
        }

        return res.status(200).json({ data: category });
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    case "DELETE":
      try {
        await dbConnect();

        const { id } = req.query;
        const role = await Category.findByIdAndDelete(id);

        if (!role) {
          res.status(404).json({ error: `Category with id ${id} not found` });
        }

        return res.status(200);
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}
