import mongoose, { Schema, Document, model } from "mongoose";
import { encrypt, decrypt, maskKey } from "@/src/util/encryption"; // Import the encryption utility

interface IVideoServer extends Document {
  publicKey?: string;
  privateKey?: string;
  secretKey?: string;
  otp?: string;
}

// Define the VideoServer Schema
const VideoServerSchema: Schema<IVideoServer> = new Schema(
  {
    publicKey: {
      type: String,
      set: (value: string) => encrypt(value), // Encrypt the publicKey before saving
    },
    privateKey: {
      type: String,
      set: (value: string) => encrypt(value), // Encrypt the privateKey before saving
    },
    secretKey: {
      type: String,
      set: (value: string) => encrypt(value), // Encrypt the secretKey before saving
    },
    otp: String,
  },
  {
    timestamps: true,
  }
);

// Decrypt sensitive fields when retrieving documents
VideoServerSchema.pre('find', function () {
  this.select('publicKey privateKey secretKey otp');
});

VideoServerSchema.pre('findOne', function () {
  this.select('publicKey privateKey secretKey otp');
});

// Add methods to decrypt and mask fields
VideoServerSchema.methods.getPublicKey = function () {
  const decryptedKey = decrypt(this.publicKey);
  return maskKey(decryptedKey); // Mask the key when returning
};

VideoServerSchema.methods.getPrivateKey = function () {
  const decryptedKey = decrypt(this.privateKey);
  return maskKey(decryptedKey); // Mask the key when returning
};

VideoServerSchema.methods.getSecretKey = function () {
  const decryptedKey = decrypt(this.secretKey);
  return maskKey(decryptedKey); // Mask the key when returning
};

VideoServerSchema.methods.getOtp = function () {
  const decryptedOtp = decrypt(this.otp);
  return maskKey(decryptedOtp); // Mask the OTP when returning
};

// Export the model
export default mongoose.models.VideoServer ||
  model<IVideoServer>("VideoServer", VideoServerSchema);
