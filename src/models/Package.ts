import mongoose, { Schema, model } from "mongoose";

interface IPackage {
  name: string;
  tag: string;
  price: number;
  parent?: Schema.Types.ObjectId; // Reference to another Package (for hierarchy)
  currency?: string;
  previewVideo: {
    _id: string;
    id: string;
    length: number;
    title: string;
    description: string;
    fileType: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema: Schema<IPackage> = new Schema(
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
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Package", // Self-referencing for parent-child relationship
    },
    previewVideo: {
      type: {
        id: String,
        length: Number,
        title: String,
        description: String,
        fileType: {
          type: String,
          default: "video",
        },
      },
      required: true,
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
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Package ||
  model<IPackage>("Package", PackageSchema);
