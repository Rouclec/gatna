// models/Account.ts

import mongoose, { Schema, Document, model } from "mongoose";

interface IAccount extends Document {
  userId: {
    type: Schema.Types.ObjectId;
    ref: "User";
  }; // Reference to User model
  companyName?: string;
  minimumWithdrawalAmount?: number;
  email?: string;
  walletId?: string;
  countryCode?: string;
  telephone?: string;
  otp?: string;
}

const AccountSchema: Schema<IAccount> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    companyName: String,
    minimumWithdrawalAmount: Number,
    email: String,
    walletId: String,
    countryCode: {
      type: String,
      default: "+237",
    },
    telephone: String,
    otp: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Account ||
  model<IAccount>("Account", AccountSchema);
