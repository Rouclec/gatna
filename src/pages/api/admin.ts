import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET": // Handle POST request to login
      try {
        // Get the session information to check if the user is logged in and has the required role
        const session = await getSession({ req });
        console.log({ session });


        // const sessionTokenCookie = req.cookies.get("next-auth.session-token");
        // const sessionToken = sessionTokenCookie?.value;

        if (!session) {
          return res.status(401).json({
            message: "You must be logged in to access this resource.",
          });
        }

        return res.status(200).json({ data: "OK" });
      } catch (error) {
        console.log({ error }, "updating password");
        return res.status(500).json({ message: error });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["GET"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}
