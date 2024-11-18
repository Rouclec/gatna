import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/src/util/db";
import { VideoServer } from "@/src/models";

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
    case "POST":
      try {
        const { publicKey, privateKey, secretKey } = req.body;

        // Create a new Coinpayment entry
        const newVideoServer = new VideoServer({
          publicKey,
          privateKey,
          secretKey,
          userId,
        });

        await newVideoServer.save();
        return res
          .status(201)
          .json({ message: "Video server info saved securely" });
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: "Error saving video server info" });
      }

    case "GET":
      try {
        const videoServer = await VideoServer.findOne();

        if (!videoServer) {
          return res
            .status(404)
            .json({ message: "Video server info not found" });
        }

        // Return the masked and decrypted keys
        return res.status(200).json({
          data: {
            publicKey: videoServer.getPublicKey(),
            privateKey: videoServer.getPrivateKey(),
            secretKey: videoServer.getSecretKey(),
          },
        });
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: "Error retrieving video server info" });
      }
    case "PUT":
      try {
        const { publicKey, privateKey, secretKey } = req.body;

        // Find the VideoServer by ID and update it
        const updatedVideoServer = await VideoServer.findOneAndUpdate(
          { userId },
          { publicKey, privateKey, secretKey },
          { new: true, runValidators: true }
        );

        if (!updatedVideoServer) {
          return res.status(404).json({ message: "VideoServer not found." });
        }

        return res
          .status(200)
          .json({ message: "VideoServer updated successfully" });
      } catch (error) {
        console.error("Error updating VideoServer:", error);
        return res.status(500).json({ message: "Error updating VideoServer." });
      }

    case "DELETE":
      try {
        // Find the VideoServer by the user id and delete it
        const deletedVideoServer = await VideoServer.findOneAndDelete({
          userId,
        });

        if (!deletedVideoServer) {
          return res.status(404).json({ message: "VideoServer not found." });
        }

        return res
          .status(200)
          .json({ message: "VideoServer deleted successfully." });
      } catch (error) {
        console.error("Error deleting VideoServer:", error);
        return res.status(500).json({ message: "Error deleting VideoServer." });
      }

    default:
      res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
