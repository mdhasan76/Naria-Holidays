import { model, Schema } from "mongoose";
import { IUser, UserMethods } from "./user.interface";
import { compare } from "bcrypt";

// IUser Schema
const userSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    displayImage: { type: String, required: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.statics.doesPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await compare(givenPassword, savedPassword);
};

export const UserModel = model<IUser, UserMethods>("User", userSchema);
