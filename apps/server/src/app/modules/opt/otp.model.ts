import { Schema, model } from "mongoose";
import { IOTP } from "./otp.interface";

const otpSchema = new Schema<IOTP>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    expireTime: {
      type: Date,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    link: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      require: false,
    },
    update: {
      type: Schema.Types.Mixed,
      required: false,
    },

    channel: {
      type: String,
      required: true,
      enum: ["email", "sms", "push", "other"],
    },
    requestIP: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const OTPModel = model<IOTP>("OTP", otpSchema);
