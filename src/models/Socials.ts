import mongoose, { Schema, Document, model } from "mongoose";

interface ISocials extends Document {
  createdBy: {
    type: Schema.Types.ObjectId;
    ref: "User";
  }; // Reference to User model
  updatedBy?: {
    type: Schema.Types.ObjectId;
    ref: "User";
  };
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  countryCode?: string;
  tiktok?: string;
  otp?: string;
}

const SocialsSchema: Schema<ISocials> = new Schema(
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
