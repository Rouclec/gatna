import mongoose, { Schema, Document, model } from "mongoose";

interface ISocials extends Document {
  userId: string;
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  countryCode?: string;
  tiktok?: string;
  otp?: string;
}

const SocialsSchema: Schema<ISocials> = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    facebook: String,
    instagram: String,
    whatsapp: String,
    countryCode: {
      type: String,
      default: "+237",
    },
    tiktok: String,
    otp: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Socials ||
  model<ISocials>("Socials", SocialsSchema);
