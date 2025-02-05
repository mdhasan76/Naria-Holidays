import { Types } from "mongoose";

export interface IOTP {
  userId: Types.ObjectId;
  expireTime: Date;
  otp: string; // it will be bcrypt
  status: boolean;
  link: string;
  phoneNumber?: string;
  update?: any;
  channel: "email" | "sms" | "push" | "other";
  requestIP: string;
}
