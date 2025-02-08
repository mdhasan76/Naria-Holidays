import httpStatus from "http-status";
import { Secret, JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import ApiError from "../../../errors/ApiError";
import { JwtHelper } from "../../../helpers/jwtHelpers";
import { ForgetPasswordPayload } from "./auth.interface";
import { config } from "../../../config/index";
import bcrypt from "bcrypt";
import { OTPModel } from "../opt/otp.model";
import { IUser } from "../user/user.interface";
import { UserModel } from "../user/user.model";
import { PasswordResetChannelType } from "../../../shared/interface";
import { OTPHelper, wrapWithSession } from "../../../helpers/utils.helper";
import { transporter } from "../../../server.utils/mail";
import { Response } from "express";

const registerUser = async (data: Partial<IUser>): Promise<IUser> => {
  // hash password
  const hashPassword = await bcrypt.hash(
    data.password,
    Number(config.default_bcrypt_round)
  );
  data.password = hashPassword;
  const newUser = new UserModel(data);
  await newUser.save();

  if (!newUser) {
    throw new Error("Failed to create user!");
  }
  const userData = newUser.toJSON();
  delete userData.password;
  return userData;
};

const login = async (
  email: string,
  password: string
): Promise<{
  _id: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}> => {
  const user = await UserModel.findOne({ email: email });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const userJson = user.toJSON();

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Wrong password");
  }

  const accessToken = await JwtHelper.createToken(
    {
      _id: userJson._id,
      email: userJson.email,
      name: userJson.userName,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = await JwtHelper.createToken(
    {
      _id: userJson._id,
      email: userJson.email,
    },
    config.jwt.refresh as Secret,
    config.jwt.refresh_expires_in as string
  );
  const userData: any = userJson;
  delete userData.password;
  delete userData.attemptWrongPassword;
  delete userData.blockingInfo;

  return {
    ...userData,
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (
  token: string
): Promise<{
  accessToken: string | null;
  user: Partial<IUser> | null;
  refreshToken?: string;
}> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken: JwtPayload | any = null;

  try {
    verifiedToken = JwtHelper.verifyToken(token, config.jwt.refresh as Secret);
  } catch (err) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh Token ");
  }

  if (verifiedToken?._id) {
    const doesUserExist = await UserModel.findOne({
      _id: verifiedToken?._id,
    });
    if (!doesUserExist) {
      throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
    }
    const newAccessToken = JwtHelper.createToken(
      {
        _id: doesUserExist._id,
        email: doesUserExist.email,
        name: doesUserExist.userName,
      },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );
    const refreshToken = await JwtHelper.createToken(
      {
        _id: doesUserExist._id,
        email: doesUserExist?.email,
      },
      config.jwt.refresh as Secret,
      config.jwt.refresh_expires_in as string
    );
    const userData: any = doesUserExist;
    delete userData.password;
    delete userData.attemptWrongPassword;
    delete userData.blockingInfo;

    return {
      accessToken: newAccessToken,
      user: userData,
      refreshToken,
    };
  } else {
    return { accessToken: null, user: null };
  }
};

// Forget password function. it will create otp and send via email or sms channel

const forgetPassword = async (
  data: ForgetPasswordPayload
): Promise<boolean> => {
  return wrapWithSession(async (session) => {
    const user = await UserModel.findOne({
      email: data?.uid,
    }).session(session);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User does not exist!");
    }

    // Generate OTP and create OTP document in db
    const otpData = await OTPHelper(
      user._id as any,
      PasswordResetChannelType.EMAIL
    );

    const [saveOtp] = await OTPModel.create([otpData.payload], { session });

    if (!saveOtp) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server error"
      );
    }
    const generatePasswordResetLink = await JwtHelper.createToken(
      {
        userId: otpData.payload.userId,
        requestId: saveOtp._id,
        otp: otpData.otp,
      },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );
    // send mail with defined transport object
    await transporter.sendMail({
      from: '"Hello from Naira Holidays 👻" <mdhasan8064@gmail.com>', // sender address
      to: "mdhasanmiah8064@gmail.com", // list of receivers
      subject: "Reset password token", // Subject line
      text: "For reset your password click the url. it will take you reset password page.", // plain text body
      html: `<b>For reset your password <a href='http://localhost:3000/reset-password/${generatePasswordResetLink}' target='_blank' rel='noopener noreferrer'}>click here</a></b>`, // html body
    });
    await session.commitTransaction();
    return true;
  });
};

// reset password via resetPasswordToken
const resetPasswordViaResetPasswordToken = async (
  resetPasswordToken: string,
  newPassword: string
): Promise<"Success"> => {
  const token: JwtPayload | undefined = await JwtHelper.verifyToken(
    resetPasswordToken,
    config.jwt.secret
  );
  if (!token) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Token not verified");
  }
  const doesExistOtp = await OTPModel.findOne({
    _id: token.requestId,
    userId: token.userId,
    status: true,
  });
  if (!doesExistOtp) {
    throw new ApiError(httpStatus.NOT_FOUND, "Otp doesn't exist!");
  }
  const userData = await UserModel.findById(token.userId);
  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const hashedPassword = await bcrypt.hash(
      newPassword,
      Number(config.default_bcrypt_round)
    );
    const user = await UserModel.findByIdAndUpdate(
      doesExistOtp?.userId,
      {
        password: hashedPassword,
      },
      { new: true, session }
    );
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to change Password!");
    }
    await OTPModel.findByIdAndDelete(token.otpId, session);
    await session.commitTransaction();
    await session.endSession();
    return "Success";
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const logout = async (id: string, res: Response): Promise<void> => {
  const user = await UserModel.findOne({ _id: id }).exec();
  if (!user) {
    throw new Error("User not found");
  }
  res.clearCookie("refreshToken");
  res.clearCookie("raw_idToken");
  res.clearCookie("accessToken");
};
export const AuthServices = {
  registerUser,
  login,
  refreshToken,
  forgetPassword,
  resetPasswordViaResetPasswordToken,
  logout,
};
