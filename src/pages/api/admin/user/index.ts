import {
  Notification,
  Package,
  Role,
  Transaction,
  User,
  UserPackage,
} from "@/src/models";
import dbConnect from "@/src/util/db";
import { sendEmailViaSMTP } from "@/src/util/email";
import generateRandomPassword from "@/src/util/password";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

function generateRandomTxnId(length: number = 26): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  return result;
}

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
    case "POST":
      try {
        // 1. Create the user
        const { email } = req.body; // Extract values from request body

        const role = await Role.findOne({ code: "user" });

        const setPassword = generateRandomPassword(16);

        const newUser = new User({
          firstName: "New",
          lastName: "User",
          email,
          active: true,
          password: setPassword,
          phoneNumber: "670000000",
          role: role?.id,
        });

        await newUser.save();

        // Convert to plain object and omit the password
        const userWithoutPassword = newUser.toObject();
        delete userWithoutPassword.password;

        console.log("CREATED NEW USER::: ", userWithoutPassword);

        // 2. create a transaction
        const { packageId } = req.body;

        console.log("PACKAGE ID:::: ", packageId);

        const pack = await Package.findById(packageId);

        if (!pack) {
          return res
            .status(404)
            .json({ message: `Package with id ${packageId} doesn't exist` });
        }

        console.log("FOUND PACKAGE:::: ", pack);

        const today = new Date();
        const nextYear = new Date(today);
        nextYear.setFullYear(nextYear.getFullYear() + 1);

        const dbTransaction = new Transaction({
          transactionId: generateRandomTxnId(),
          package: packageId,
          user: newUser._id,
          status: "completed",
          amount: pack.price,
          assignedByAdmin: true,
          currency1: pack.currency,
        });

        console.log("CREATED NEW TRANSACTION:::::: ", dbTransaction);

        await dbTransaction.save();

        // 3. Create a new user package with active true and expiry date set
        const newUserPackage = new UserPackage({
          user: newUser._id,
          package: packageId,
          active: true,
          assignedByAdmin: true,
          expiration: nextYear,
        });

        await newUserPackage.save();

        console.log("CREATED NEW USER PACKAGE:::::: ", newUserPackage);

        // 4. Send the user their confirmation mail with their password
        const protocol = req.headers["x-forwarded-proto"] || "https"; // Use "https" in production
        const host = req.headers.host; // Get the host (e.g., localhost:3000 or my-domain.com)
        const signin_url = `${protocol}://${host}/signin?email=${email}`;

        await sendEmailViaSMTP({
          to: email,
          subject: "Welcome to Gatna.io",
          body: `<p>Welcome to Gatna.io <br /> Your password is <strong>${setPassword}</strong> <a href=${signin_url}>Login here</a><br />Feel free to change the password in the settings section of your account</p>`,
        });

        console.log(":::::SENT EMAIL TO NEW USER:::::");

        // 5. create a new notification for this
        const notification = new Notification({
          title: `Payment initiated`,
          body: `The package ${pack.name} has been assigned to the user ${email} by an admin`,
        });

        await notification.save();

        console.log("NEW ADMIN NOTIFICATION CREATED::::: ", notification);

        return res.status(200).json({ data: newUserPackage });
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    case "PUT":
      try {
        const { firstName, lastName, email, _id, countryCode, phoneNumber } =
          req.body;

        const userFound = await User.findById(_id);

        if (!userFound.active) {
          return res.status(404).json({
            message: `No active user with id: ${_id}`,
          });
        }

        const user = await User.findByIdAndUpdate(
          _id,
          {
            firstName,
            lastName,
            email,
            countryCode,
            phoneNumber,
          },
          { new: true }
        );

        return res.status(200).json({ data: user });
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["PUT"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}
