import mongoose, { Schema, Document, model } from "mongoose";
import { encrypt, maskKey, decrypt } from "../util/encryption";

interface ICoinpayment extends Document {
  userId: Schema.Types.ObjectId; // Reference to User model
  publicKey?: string;
  privateKey?: string;
  secretKey?: string;
  otp?: string;
}

// Define the Coinpayment Schema
const CoinpaymentSchema: Schema<ICoinpayment> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
    publicKey: {
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
    otp: String,
  },
  {
    timestamps: true,
  }
);

// Decrypt sensitive fields before returning to the client
CoinpaymentSchema.pre("find", function () {
  this.select("publicKey privateKey secretKey otp");
});

CoinpaymentSchema.pre("findOne", function () {
  this.select("publicKey privateKey secretKey otp");
});

// Decrypt fields when retrieving documents
CoinpaymentSchema.methods.getPublicKey = function () {
  const decryptedKey = decrypt(this.publicKey);
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

export default mongoose.models.Coinpayment ||
  model<ICoinpayment>("Coinpayment", CoinpaymentSchema);
