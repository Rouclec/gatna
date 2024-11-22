import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/src/util/db";
import { Coinpayment } from "@/src/models";
import { verifyEntityOTP } from "@/src/util/otp";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // Ensure database connection

  const token = await getToken({ req, secret });

  if (!token) {
    return res
      .status(401)
      .json({ message: "You must be logged in to access this resource." });
  }

  const userId = token.id; // ID of the logged-in user
  const isAdmin = token.role === "admin"; // Check if user is admin

  if (!isAdmin) {
    return res
      .status(403)
      .json({ message: "You do not have permission to perform this action" });
  }

  switch (req.method) {
    // case "POST":
    //   try {
    //     const { ipnSecret, privateKey, secretKey, otp } = req.body;

    //     const validOTP = await verifyEntityOTP(Coinpayment, otp);
    //     if (!validOTP) {
    //       return res.status(400).json({ message: "Invalid otp" });
    //     }

    //     // Create a new Coinpayment entry
    //     const newCoinpayment = new Coinpayment({
    //       ipnSecret,
    //       privateKey,
    //       secretKey,
    //       createdBy: userId,
    //     });

    //     await newCoinpayment.save();
    //     return res
    //       .status(201)
    //       .json({ message: "Coinpayment info saved securely" });
    //   } catch (error) {
    //     console.error(error);
    //     return res
    //       .status(500)
    //       .json({ message: "Error saving Coinpayment info" });
    //   }

    case "GET":
      try {
        const coinpayment = await Coinpayment.findOne();

        if (!coinpayment) {
          return res
            .status(404)
            .json({ message: "Coinpayment info not found" });
        }

        // Return the masked and decrypted keys
        return res.status(200).json({
          data: {
            _id: coinpayment._id,
            createdAt: coinpayment.createdAt,
            updatedAt: coinpayment.updatedAt,
            ipnSecret: coinpayment.getIpnSecret(),
            privateKey: coinpayment.getPrivateKey(),
            secretKey: coinpayment.getSecretKey(),
          },
        });
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: "Error retrieving Coinpayment info" });
      }

    case "PUT":
      try {
        const { ipnSecret, privateKey, secretKey, otp } = req.body;

        const validOTP = await verifyEntityOTP(Coinpayment, otp);
        if (!validOTP) {
          return res.status(400).json({ message: "Invalid otp" });
        }

        let createdBy = userId;

        const existingCoinPayment = await Coinpayment.findOne();

        if (existingCoinPayment.createdBy) {
          createdBy = existingCoinPayment.createdBy;
        }

        // Find the Coinpayment by ID and update it
        const updatedCoinpayment = await Coinpayment.findOneAndUpdate(
          {},
          { ipnSecret, privateKey, secretKey, updatedBy: userId, createdBy },
          { new: true, runValidators: true }
        );

        if (!updatedCoinpayment) {
          return res.status(404).json({ message: "Coinpayment not found." });
        }

        return res
          .status(200)
          .json({ message: "Coinpayment updated successfully" });
      } catch (error) {
        console.error("Error updating Coinpayment:", error);
        return res.status(500).json({ message: "Error updating Coinpayment." });
      }

    case "DELETE":
      try {
        // Find the Coinpayment by the user id and delete it
        const deletedCoinpayment = await Coinpayment.findOneAndDelete();

        if (!deletedCoinpayment) {
          return res.status(404).json({ message: "Coinpayment not found." });
        }

        return res
          .status(200)
          .json({ message: "Coinpayment deleted successfully." });
      } catch (error) {
        console.error("Error deleting Coinpayment:", error);
        return res.status(500).json({ message: "Error deleting Coinpayment." });
      }

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
