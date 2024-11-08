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
  resetToken?: string;
  resetTokenExpiration?: Date;
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
    resetToken: String,
    resetTokenExpiration: Date,
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

// Pre-save hook to hash the password if it's new or modified
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Hash the password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Middleware method to compare passwords
UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Middleware method to create a reset token
UserSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the reset token before saving it
  this.resetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetTokenExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  return resetToken; // Return plain token to be sent to the user
};

export default mongoose.models.User || model<IUser>("User", UserSchema);
