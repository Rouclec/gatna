import mongoose, { Schema, model } from "mongoose";

interface ICategory {
  name: string;
  tag: string;
  price: number;
  currency?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema<ICategory> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    tag: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    currency: {
        type: String,
        default: "USD",
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Category ||
  model<ICategory>("Category", CategorySchema);
