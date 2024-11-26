import dbConnect from "@/src/util/db";
import { NextApiRequest, NextApiResponse } from "next";
import Coinpayments from "coinpayments";
import {
  Coinpayment,
  Notification,
  Package,
  Transaction,
  User,
  UserPackage,
} from "@/src/models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // Ensure database connection

  switch (req.method) {
    case "POST": // Handle POST request to login
      try {
        const protocol = req.headers["x-forwarded-proto"] || "https"; // Use "https" in production
        const host = req.headers.host; // Get the host (e.g., localhost:3000 or my-domain.com)
        const successUrl = `${protocol}://${host}/signin`;

        const { userId, packageId } = req.body;

        const coinPaymentInfo = await Coinpayment.findOne();

        if (!coinPaymentInfo) {
          return res
            .status(404)
            .json({ message: "No coinpayment info found on server" });
        }

        const coinpaymentsClient = new Coinpayments({
          key: coinPaymentInfo.getDecryptedPrivateKey() as string,
          secret: coinPaymentInfo.getDecryptedSecretKey() as string,
        });

        const user = await User.findById(userId);

        if (!user) {
          return res
            .status(404)
            .json({ message: `User with id ${userId} doesn't exist` });
        }

        const pack = await Package.findById(packageId);

        if (!pack) {
          return res
            .status(404)
            .json({ message: `Package with id ${packageId} doesn't exist` });
        }

        const existingUserPackage = await UserPackage.findOne({
          user: userId,
          packge: packageId,
          active: true,
        });

        if (!!existingUserPackage) {
          return res.status(500).json({
            message: `User with id ${userId} already has this package: ${packageId}`,
          });
        }

        const transaction = await coinpaymentsClient.createTransaction({
          currency1: pack.currency,
          currency2: "USDT.TRC20",
          // amount: Package.price, //TODO: revert this to use the Package's price
          amount: 12,
          buyer_email: user.email,
          item_name: user.firstName,
          success_url: successUrl,
        });

        const dbTransaction = new Transaction({
          transactionId: transaction.txn_id,
          package: packageId,
          user: userId,
          amount: pack.price,
          currency1: pack.currency,
        });

        await dbTransaction.save();

        const newUserPackage = new UserPackage({
          user: userId,
          package: packageId,
        });

        await newUserPackage.save();

        const notification = new Notification({
          title: `Payment initiated`,
          body: `${user?.email} has initiated payment for the package ${pack.name}`,
        });

        await notification.save();

        return res.status(200).json({ data: transaction });
      } catch (error) {
        console.error({ error }, "initiating payment");
        return res.status(500).json({ message: error });
      }
    default: // Handle unsupported methods
      res.setHeader("Allow", ["POST"]); // Set allowed methods in the response header
      return res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with 405 if method is not allowed
  }
}
