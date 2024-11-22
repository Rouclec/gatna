import mongoose, { Schema, Document, model } from "mongoose";

interface IUserCourses extends Document {
  user: Schema.Types.ObjectId; // Reference to the user
  package: Schema.Types.ObjectId; // course id
  active: boolean; // Whether the user's access is active
  expiration: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserCoursesSchema: Schema<IUserCourses> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    package: {
      type: Schema.Types.ObjectId,
      ref: "Package", // Reference to the Course model
    },
    active: {
      type: Boolean,
      default: false, // Default value is false
    },
    expiration: Date,
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

export default mongoose.models.UserCourses ||
  model<IUserCourses>("UserCourses", UserCoursesSchema);
