import { User } from "@/src/models";

import dbConnect from "@/src/util/db";
import { verifyEntityOTP } from "@/src/util/otp";
import generateRandomPassword from "@/src/util/password";
import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // Ensure a connection to the database

  switch (req.method) {
    case "POST":
      try {
        const { email, otp } = req.body; // Extract email and password from request body

        const protocol = req.headers["x-forwarded-proto"] || "https"; // Use "https" in production
        const host = req.headers.host; // Get the host (e.g., localhost:3000 or my-domain.com)
        const signin_url = `${protocol}://${host}/signin?email=${email}`;

        const user = await User.findOne({ email });

        if (!user) {
          return res.status(200).json({ message: "user not found" });
        }

        const validOTP = await verifyEntityOTP(User, otp, user._id as string);
        if (!validOTP) {
          return res.status(400).json({ message: "Invalid otp" });
        }

        const newPassword = generateRandomPassword(10);

        console.log("Updating user password...");
        await User.findByIdAndUpdate(user._id, {
          password: newPassword,
        });

        const mailerSend = new MailerSend({
          apiKey: process.env.MAIL_API_KEY as string,
        });
        const sentFrom = new Sender(
          process.env.EMAIL_FROM as string,
          "Gatna.io"
        );
        const recipients = [new Recipient(user.email, user.firstName)];
        const emailParams = new EmailParams()
          .setFrom(sentFrom)
          .setTo(recipients)
          .setReplyTo(sentFrom)
          .setSubject("Password Reset")
          .setHtml(
            `<p>Your new password for Gatna.io is <strong>${newPassword}</strong>. <a href=${signin_url}>Login here</a><br />Feel free to change the password in the settings section of your account</p>`
          )
          .setText("Password reset");

        await mailerSend.email.send(emailParams);

        return res.status(200).json({ message: "Password rest successfull" });
      } catch (error) {
        console.error({ error }, "updating password");
        return res.status(500).json({ message: error });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["POST"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}
