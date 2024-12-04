// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import "dotenv/config";
// import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { sendEmailViaSMTP } from "@/src/util/email";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST":
        // const mailerSend = new MailerSend({
        //   apiKey: process.env.MAIL_API_KEY as string,
        // });

        const { email, name, surname, phoneNumber, message } = req.body;

        //   const sentFrom = new Sender(
        //     process.env.EMAIL_FROM as string,
        //     "Gatna.io"
        //   );

        //   const recipients = [
        //     new Recipient(
        //       process.env.CONTACT_EMAIL as string,
        //       "Gatna.io support"
        //     ),
        //   ];

        //   const emailParams = new EmailParams()
        //     .setFrom(sentFrom)
        //     .setTo(recipients)
        //     .setReplyTo(new Recipient(email, `${name + surname}`))
        //     .setSubject(`New contact form submission ${name}`)
        //     .setHtml(
        //       `
        //       <h3>New Contact Form Submission</h3>
        //       <p><strong>Name:</strong> ${name + " " + surname}</p>
        //       <p><strong>Phone number: </strong>${phoneNumber}</p>
        //       <p><strong>Email:</strong> ${email}</p>
        //       <p><strong>Message:</strong></p>
        //       <p>${message}</p>
        // `
        //     )
        //     .setText(
        //       `New contact form submittion from ${name + surname}, ${email}`
        //     );

        //   await mailerSend.email.send(emailParams);

        await sendEmailViaSMTP({
          to: process.env.ELASTIC_EMAIL_SENDER_EMAIL as string,
          subject: `New contact form submission ${name}`,
          body: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name + " " + surname}</p>
          <p><strong>Phone number: </strong>${phoneNumber}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
    `,
          replyTo: email,
        });

        return res
          .status(200)
          .json({ data: `Email sent to ${process.env.CONTACT_EMAIL}` });
      default:
        res.setHeader("Allow", ["POST"]); // Set allowed methods in the response header
        return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
    }
  } catch (error) {
    console.error({ error }, "sending email");
    return res.status(500).json({ message: error });
  }
}
