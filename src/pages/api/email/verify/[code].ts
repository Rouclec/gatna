// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import "dotenv/config";
import { decrypt } from "@/src/util/encryption";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST":
        const { code } = req.query;
        const { encryptedString } = req.body;

        const decryptedTokenString = decrypt(encryptedString);

        const decryptedToken = JSON.parse(decryptedTokenString);

        if (
          decryptedToken.code !== code ||
          decryptedToken.expiry < new Date()
        ) {
          return res.status(400).json({ message: "Invalid code" });
        }

        return res.status(200).json({});
      default:
        res.setHeader("Allow", ["POST"]); // Set allowed methods in the response header
        return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
    }
  } catch (error) {
    console.error({ error }, "verifying otp");
    return res.status(500).json({ message: error });
  }
}
