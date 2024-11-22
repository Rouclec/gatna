// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import "dotenv/config";
import dbConnect from "@/src/util/db";
import { getToken } from "next-auth/jwt";
import { Coinpayment } from "@/src/models";
import { getEntityOTP } from "@/src/util/otp";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect(); // Ensure database connection

    // Fallback to getToken if session is initially null
    const authToken = await getToken({ req, secret });

    if (!authToken) {
      return res
        .status(401)
        .json({ message: "You must be logged in to access this resource." });
    }

    const isAdmin = authToken?.role === "admin"; // Check if user is admin

    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }

    switch (req.method) {
      case "GET":
        await getEntityOTP(
          Coinpayment,
          authToken?.email as string,
          authToken?.name as string,
        );

        return res
          .status(200)
          .json({ data: `OTP SENT to ${authToken?.email}` });
      default:
        res.setHeader("Allow", ["GET"]); // Set allowed methods in the response header
        return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
    }
  } catch (error) {
    console.error({ error }, "sending email");
    return res.status(500).json({ message: error });
  }
}
