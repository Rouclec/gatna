/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Model, Document, Default__v, Require_id, IfAny } from "mongoose";
import { encrypt, decrypt } from "./encryption";
import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Account, Socials, Coinpayment, VideoServer } from "../models";

/**
 * Creates or updates an entity based on the provided userId.
 *
 * @param model - The Mongoose model representing the entity.
 * @param email - The email to send the OTP to.
 * @param name - The name of the user
 * @param userId - The userId to identify the entity. (Optional)
 * @param _id - The id of the entity (in the case of a user entity) (Optional)
 * @returns The created or updated entity.
 */
export async function getEntityOTP<T extends Document>(
  model: Model<T>,
  email: string,
  name: string,
  userId?: string,
  _id?: string
): Promise<T | null> {
  try {
    const mailerSend = new MailerSend({
      apiKey: process.env.MAIL_API_KEY as string,
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const sentFrom = new Sender(process.env.EMAIL_FROM as string, "Gatna.io");

    const recipients = [new Recipient(email, name)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("OTP Verification Code")
      .setHtml(
        `<p><strong>${otp}</strong> is your verification code for gatna.io. This will expire in <strong>5 minutes</strong><br/> If you didn't request for a verifcation code, please contact customer support</p>`
      )
      .setText("This is the text content");

    await mailerSend.email.send(emailParams);

    const now = new Date();
    const token = {
      otp,
      expiry: new Date(now.getTime() + 5 * 60 * 1000),
    };

    const encryptedToken = encrypt(JSON.stringify(token));

    // Find and update the entity if it exists
    if (!!_id) {
      const updatedEntity = await model.findByIdAndUpdate(
        _id,
        {
          $set: {
            otp: encryptedToken,
          },
        },
        { new: true, upsert: true } // `upsert` ensures creation if it doesn't exist
      );
      return updatedEntity;
    } else {
      const updatedEntity = await model.findOneAndUpdate(
        { userId },
        {
          $set: {
            otp: encryptedToken,
          },
        },
        { new: true, upsert: true } // `upsert` ensures creation if it doesn't exist
      );
      return updatedEntity;
    }
  } catch (error) {
    console.error("Error in createOrUpdateEntity:", error);
    throw new Error("Could not create or update entity");
  }
}

/**
 * Creates or updates an entity based on the provided userId.
 *
 * @param model - The Mongoose model representing the entity.
 * @param otp - string
 * @param userId - The userId to identify the entity. (optional)
 * @param _id - The id of the entity (in case of user entity) (optional)
 * @returns The created or updated entity.
 */
export async function verifyEntityOTP<
  T extends { userId: string; otp: string }
>(
  model: Model<T>,
  otp: string,
  userId?: string,
  _id?: string
): Promise<boolean | null> {
  try {
    // Find and update the entity if it exists
    let entity: IfAny<
      T,
      any,
      Document<unknown, {}, T> & Default__v<Require_id<T>>
    > | null = null;

    if (_id) {
      entity = await model.findById(_id).select("+otp");
    } else {
      entity = await model.findOne({ userId }).select("+otp");
    }

    if (!entity) {
      throw new Error(`No ${model} found for user with id: ${userId}`);
    }

    const decryptedTokenString = decrypt(entity.otp);

    const decryptedToken = JSON.parse(decryptedTokenString);

    if (
      decryptedToken.otp !== otp ||
      new Date(decryptedToken.expiry) < new Date()
    ) {
      return false;
    }
    await model.findByIdAndUpdate(entity._id, { otp: null });
    return true;
  } catch (error) {
    console.error("Error in createOrUpdateEntity:", error);
    throw new Error("Could not create or update entity");
  }
}
