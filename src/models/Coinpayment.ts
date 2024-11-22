import mongoose, { Schema, Document, model } from "mongoose";
import { encrypt, maskKey, decrypt } from "../util/encryption";

interface ICoinpayment extends Document {
  createdBy: {
    type: Schema.Types.ObjectId;
    ref: "User";
  }; // Reference to User model
  updatedBy?: {
    type: Schema.Types.ObjectId;
    ref: "User";
  };
  ipnSecret?: string;
  privateKey?: string;
  secretKey?: string;
  otp?: string;
}

// Define the Coinpayment Schema
const CoinpaymentSchema: Schema<ICoinpayment> = new Schema(
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
    ipnSecret: {
      type: String,
      set: (value: string) => encrypt(value), // Encrypt value before saving
    },
    privateKey: {
      type: String,
      set: (value: string) => encrypt(value), // Encrypt value before saving
    },
    secretKey: {
      type: String,
      set: (value: string) => encrypt(value), // Encrypt value before saving
    },
    otp: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Decrypt sensitive fields before returning to the client
CoinpaymentSchema.pre("find", function () {
  this.select("ipnSecret privateKey secretKey otp");
});

CoinpaymentSchema.pre("findOne", function () {
  this.select("ipnSecret privateKey secretKey otp");
});

// Decrypt fields when retrieving documents
CoinpaymentSchema.methods.getIpnSecret = function () {
  const decryptedKey = decrypt(this.ipnSecret);
  return maskKey(decryptedKey); // Mask the key when returning
};

CoinpaymentSchema.methods.getPrivateKey = function () {
  const decryptedKey = decrypt(this.privateKey);
  return maskKey(decryptedKey); // Mask the key when returning
};

CoinpaymentSchema.methods.getSecretKey = function () {
  const decryptedKey = decrypt(this.secretKey);
  return maskKey(decryptedKey); // Mask the key when returning
};

CoinpaymentSchema.methods.getOtp = function () {
  const decryptedOtp = decrypt(this.otp);
  return maskKey(decryptedOtp); // Mask the OTP when returning
};

CoinpaymentSchema.methods.getDecryptedIpnSecret = function () {
  return decrypt(this.ipnSecret);
};

CoinpaymentSchema.methods.getDecryptedPrivateKey = function () {
  return decrypt(this.privateKey);
};

CoinpaymentSchema.methods.getDecryptedSecretKey = function () {
  return decrypt(this.secretKey);
};

export default mongoose.models.Coinpayment ||
  model<ICoinpayment>("Coinpayment", CoinpaymentSchema);
