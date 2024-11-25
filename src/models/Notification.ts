// src/models/Notification.ts
import mongoose, { Schema, Document, model } from "mongoose";
import slugify from "slugify";
import uniqueValidator from "mongoose-unique-validator";

interface INotification extends Document {
  name: string;
  code: string;
  read: boolean;
}

const NotificationSchema: Schema = new Schema(
  {
    title: String,
    body: String,
    read: {
      type: Boolean,
      deafult: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export default mongoose.models.Notification || model<INotification>("Notification", NotificationSchema);
