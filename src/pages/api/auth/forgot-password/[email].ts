// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import "dotenv/config";
import dbConnect from "@/src/util/db";
import { User } from "@/src/models";
import { getEntityOTP } from "@/src/util/otp";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect(); // Ensure database connection

    const { email } = req.query;

    console.log({ email });

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Error sending otp" });
    }

    switch (req.method) {
      case "GET":
        await getEntityOTP(
          User,
          user?.email as string,
          user?.name as string,
          user?._id as string
        );

        return res.status(200).json({ data: `OTP SENT to ${email}` });
      default:
        res.setHeader("Allow", ["GET"]); // Set allowed methods in the response header
        return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
    }
  } catch (error) {
    console.error({ error }, "sending email");
    return res.status(500).json({ message: error });
  }
}
