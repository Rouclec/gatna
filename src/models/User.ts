/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose, { Schema, Document, model, QueryWithHelpers } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: {
    type: Schema.Types.ObjectId;
    ref: "Role";
    code?: string;
  };
  lastLogin: Date;
  active: boolean;
  otp?: string;
  comparePassword(password: string): Promise<boolean>;
  createResetToken(): string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false, // Prevent password from being selected by default
      validate: {
        validator: function (value: string) {
          // Regular expression for strong password
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/.test(value);
        },
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one special character.",
      },
      set: (value: string) => bcrypt.hashSync(value, 10),
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    lastLogin: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: true,
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

// Pre-find hook to populate only the role code
// eslint-disable-next-line @typescript-eslint/no-explicit-any
UserSchema.pre<QueryWithHelpers<any, IUser>>(
  ["find", "findOne"],
  function (next) {
    this.populate({
      path: "role",
      select: "code",
    });
    next();
  }
);

// // Pre-save hook to hash the password if it's new or modified
// UserSchema.pre<IUser>("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   // Hash the password
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Pre-update hook for `findOneAndUpdate`, `updateOne`, and `findByIdAndUpdate`
// UserSchema.pre<IUser>("findOneAndUpdate", async function (next) {
//   if (!this.isModified("password")) return next();

//   // Hash the password
//   this.password = await bcrypt.hash(this.password, 10);
//   next();

//   next();
// });

// Middleware method to compare passwords
UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.models.User || model<IUser>("User", UserSchema);
