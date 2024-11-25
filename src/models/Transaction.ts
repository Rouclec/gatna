import mongoose, { Schema, Document, model } from "mongoose";

interface ITransaction extends Document {
  transactionId: string; // CoinPayments transaction ID
  package: Schema.Types.ObjectId; // Reference to the purchased course
  user: Schema.Types.ObjectId; // Reference to the user making the purchase
  status: string; // Transaction status (pending, completed, failed, etc.)
  amount: number; // Amount paid in USD
  currency1: string; // Original currency (e.g., USD)
  currency2: string; // Cryptocurrency used for payment (e.g., BTC)
  type?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema<ITransaction> = new Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true, // Ensure no duplicate transactions
    },
    package: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: true, // Ensure every transaction is linked to a course
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the user model
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "expired", "refunded"], // CoinPayments-like statuses
      default: "pending",
    },
    type: {
      type: String,
      enum: ["transfer", "withdrawal"],
      default: "transfer",
    },
    amount: {
      type: Number,
      required: true,
    },
    currency1: {
      type: String,
      default: "USD", // Your default currency
    },
    currency2: {
      type: String, // Cryptocurrency used
      default: "USDT.TRC20",
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

export default mongoose.models.Transaction ||
  model<ITransaction>("Transaction", TransactionSchema);
