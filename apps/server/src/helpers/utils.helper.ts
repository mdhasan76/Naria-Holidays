import mongoose, { ClientSession, Types } from "mongoose";
import { PasswordResetChannelType } from "../shared/interface";
import { IOTP } from "../app/modules/opt/otp.interface";
import bcrypt from "bcrypt";
import { config } from "../config";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status";
import { IUser } from "../app/modules/user/user.interface";
import { UserModel } from "../app/modules/user/user.model";
import { Request } from "express";

export function generateOTP() {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}
export async function OTPHelper(
  userId: Types.ObjectId,
  channelName: PasswordResetChannelType,
  restData?: Partial<IOTP>
): Promise<{ payload: any; otp: string }> {
  const otp = generateOTP();
  const bcryptOtp = await bcrypt.hash(otp, Number(config.default_bcrypt_round));
  const time: any = new Date();
  const payload = {
    userId,
    expireTime: time.getTime() + 300000,
    otp: bcryptOtp,
    status: true,
    channel: channelName,
    ...restData,
  };
  return { payload, otp };
}

export const wrapWithSession = async <T>(
  fn: (session: ClientSession) => Promise<T>
): Promise<T> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await fn(session);
    await session.commitTransaction();
    return result;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};
export const checkOTPTimeValidation = (data: {
  lastTimeOTPSended: Date;
  timeLimit: number;
}): void => {
  const presentDate = new Date().getTime();
  const lastOTPSendTime = new Date(data.lastTimeOTPSended).getTime();
  const otpTimeGap = presentDate - lastOTPSendTime;
  if (otpTimeGap < data.timeLimit) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You already got an OTP. Try after ${Math.ceil(
        (data.timeLimit - otpTimeGap) / 1000
      )} seconds.`
    );
  }
};
export const doesUserExist = async (
  userId: string
): Promise<{ by: { name: string; id: string }; user: IUser }> => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Creator not found");
  }
  const by = {
    name: user?.userName,
    id: user?._id,
  };
  return { by, user };
};

export const generateBy = (req: Request) => {
  return {
    name: req.user.userName,
    id: req.user._id,
  };
};
