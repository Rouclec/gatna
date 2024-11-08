import Role from "@/src/models/Role";
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

        const role = await Role.findById(id);

        if (!role) {
          return res
            .status(404)
            .json({ message: `Role with id ${id} not found` });
        }
        return res.status(200).json({ data: role }); // Respond with the created role
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    case "PUT": // Handle GET request to fetch all roles
      try {
        const { id } = req.query;
        const { name } = await req.body;
        const role = await Role.findByIdAndUpdate(id, { name }, { new: true });

        if (!role) {
          return res
            .status(404)
            .json({ message: `Role with id ${id} not found` });
        }

        return res.status(200).json({ data: role });
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    case "DELETE":
      try {
        await dbConnect();

        const { id } = req.query;
        const role = await Role.findByIdAndDelete(id);

        if (!role) {
          res.status(404).json({ error: `Role with id ${id} not found` });
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
