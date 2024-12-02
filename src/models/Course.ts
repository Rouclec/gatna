import mongoose, { Schema, Document, model } from "mongoose";

interface ICourse extends Document {
  video: {
    _id: string;
    id: string;
    length: number;
    title: string;
    description: string;
    fileType: string;
  };
  pdf: {
    _id: string;
    link: string;
    title: string;
    description: string;
    fileType: string;
  };
  package: {
    type: Schema.Types.ObjectId;
    ref: "Package";
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
    package: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    video: {
      id: String,
      length: Number,
      title: String,
      description: String,
      fileType: {
        type: String,
        default: "video",
      },
    },
    pdf: {
      link: String,
      title: String,
      description: String,
      fileType: {
        type: String,
        default: "pdf",
      },
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


// CourseSchema.pre("find", function (next) {
//   // Ensure that TypeScript understands the context
//   this.populate({
//     path: "package",
//     select: "name tag price currency previewVideo parent", // Only select the fields you need
//   });
//   next();
// });

// CourseSchema.pre("findOneAndUpdate", function (next) {
//   // Automatically populate the `package` field on update queries
//   this.populate({
//     path: "package",
//     select: "name tag price currency previewVideo parent", // Only select the fields you need
//   });
//   next();
// });

export default mongoose.models.Course || model<ICourse>("Course", CourseSchema);
