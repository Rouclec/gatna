/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose, { Schema, Document, model, QueryWithHelpers } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

interface ICourse extends Document {
  price: number;
  currency?: string;
  videos: {
    _id: string;
    id: string;
    length: number;
    title: string;
    description: string;
    fileType: string;
  }[];
  pdfs: {
    _id: string;
    link: string;
    title: string;
    description: string;
    fileType: string;
  }[];
  category: {
    type: Schema.Types.ObjectId;
    ref: "Category";
    name: string;
    tag: string;
  };
  duration: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema<ICourse> = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    videos: [
      {
        id: String,
        length: Number,
        title: String,
        description: String,
        fileType: {
          type: String,
          default: "video",
        },
      },
    ],
    pdfs: [
      {
        link: String,
        title: String,
        description: String,
        fileType: {
          type: String,
          default: "pdf",
        },
      },
    ],
    duration: Number,
    published: {
      type: Boolean,
      default: true,
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

// Pre-create middleware to calculate `duration` before saving
CourseSchema.pre("save", function (next) {
  // Calculate total duration from the `videos` array
  if (this.isNew && this.videos) {
    this.duration = this.videos.reduce(
      (
        total: number,
        video: {
          id: string;
          length: number;
          title: string;
          description: string;
        }
      ) => total + (video.length || 0),
      0
    );
  }
  next();
});

// Post-update middleware to recalculate `duration` after update
CourseSchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return; // If no document was found, skip

  // Recalculate the duration based on the updated videos
  if (doc.videos && Array.isArray(doc.videos)) {
    const totalDuration = doc.videos.reduce(
      (
        total: number,
        video: {
          id: string;
          length: number;
          title: string;
          description: string;
        }
      ) => total + (video.length || 0),
      0
    );

    // Update the document with the new duration
    doc.duration = totalDuration;
    await doc.save(); // Save the document to persist changes
  }
});

CourseSchema.pre("find", function (next) {
  // Ensure that TypeScript understands the context
  this.populate({
    path: "category",
    select: "name tag", // Only select the fields you need
  });
  next();
});

CourseSchema.pre("findOneAndUpdate", function (next) {
  // Automatically populate the `category` field on update queries
  this.populate({
    path: "category",
    select: "name tag",
  });
  next();
});

export default mongoose.models.Course || model<ICourse>("Course", CourseSchema);
