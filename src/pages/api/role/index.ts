import { Role } from "@/src/models";

import dbConnect from "@/src/util/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

interface RoleFilter {
  code?: string;
  name?: string;
}

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
    case "POST": // Handle POST request to create a new role
      try {
        const { name } = req.body; // Extract name from the request body
        const newRole = new Role({ name }); // Create a new Role instance

        await newRole.save(); // Save the new role to the database
        return res.status(201).json({ data: newRole }); // Respond with the created role
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    case "GET": // Handle GET request to fetch roles, with optional filtering
      try {
        const { code, name } = req.query; // Extract query parameters
        const filter: RoleFilter = {}; // Initialize a filter object of type RoleFilter

        // Add filters if query parameters are provided
        if (code) filter.code = code as string;
        if (name) filter.name = name as string;

        const roles = await Role.find(filter); // Fetch roles based on the filter
        return res.status(200).json({ data: roles }); // Respond with the filtered list of roles
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["GET", "POST"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}
