import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.elasticemail.com",
  port: 587,
  auth: {
    user: process.env.ELASTIC_EMAIL_SMTP_USERNAME,
    pass: process.env.ELASTIC_EMAIL_SMTP_PASSWORD,
  },
});

interface Props {
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
  senderName?: string;
}

export const sendEmailViaSMTP = async ({
  to,
  subject,
  body,
  replyTo,
  senderName = "Gatna.io",
}: Props) => {
  await transporter.sendMail({
    from: `"${senderName}" <${process.env.ELASTIC_EMAIL_SENDER_EMAIL}>`, // Format: "Name <email@example.com>"
    to,
    subject,
    html: body,
    replyTo, // Add a reply-to email address if provided
  });
};
