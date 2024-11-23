// src/models/Role.ts
import mongoose, { Schema, Document, model } from "mongoose";
import slugify from "slugify";
import uniqueValidator from "mongoose-unique-validator";

interface IRole extends Document {
  name: string;
  code: string;
}

const RoleSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for this role"],
      unique: true,
    },
    code: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

RoleSchema.plugin(uniqueValidator, {
  message: "{PATH} {VALUE} already in use, please try another!",
}); //enable beautifying on this schema

RoleSchema.pre<IRole>("save", function (next) {
  this.code = slugify(this.name, { lower: true });
  next();
});

export default mongoose.models.Role || model<IRole>("Role", RoleSchema);