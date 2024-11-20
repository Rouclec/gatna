import { Course } from "@/src/models";
import dbConnect from "@/src/util/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // Ensure a connection to the database

  switch (req.method) {
    case "GET": // Handle GET request to fetch all courses
      try {
        const { id } = req.query;

        const course = await Course.findById(id);

        if (!course) {
          return res
            .status(404)
            .json({ message: `Course with id ${id} not found` });
        }

        return res.status(200).json({ data: course });
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["GET"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}
