// models/Account.ts

import mongoose, { Schema, Document, model } from "mongoose";

interface IAccount extends Document {
  createdBy: {
    type: Schema.Types.ObjectId;
    ref: "User";
  }; // Reference to User model
  updatedBy?: {
    type: Schema.Types.ObjectId;
    ref: "User";
  };
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
    otp: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Account ||
  model<IAccount>("Account", AccountSchema);
