import mongoose, { Schema, Document, model } from "mongoose";

interface IWithdrawal extends Document {
  user: Schema.Types.ObjectId; // Reference to the user making the purchase
  status: string; // Withdrawal status (pending, completed, failed, etc.)
  amount: number; // Amount paid in USD
  currency: string; // Original currency (e.g., USD)
  walletId: string;
  type?: string;
  createdAt: Date;
  updatedAt: Date;
}

const withdrawalSchema: Schema<IWithdrawal> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the user model
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "canceled", "expired", "refunded"], // CoinPayments-like statuses
      default: "pending",
    },
    walletId: {
      type: String,
      required: true,
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
    currency: {
      type: String,
      default: "USD", // Your default currency
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

export default mongoose.models.Withdrawal ||
  model<IWithdrawal>("Withdrawal", withdrawalSchema);
