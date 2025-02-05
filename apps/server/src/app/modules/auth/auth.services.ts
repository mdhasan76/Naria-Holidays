import httpStatus from "http-status";
import { Secret, JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import ApiError from "../../../errors/ApiError";
import { JwtHelper } from "../../../helpers/jwtHelpers";
import {
  ForgetPasswordPayload,
  IPasswordChangeWithOldPassword,
} from "./auth.interface";
import { config } from "../../../config/index";
import bcrypt from "bcrypt";
import { Response } from "express";
import { OTPModel } from "../opt/otp.model";
import { IUser } from "../user/user.interface";
import { UserModel } from "../user/user.model";
import {
  OTPSenderType,
  PasswordResetChannelType,
} from "../../../shared/interface";
import {
  checkOTPTimeValidation,
  generateOTP,
  OTPHelper,
  wrapWithSession,
} from "../../../helpers/utils.helper";

/* Needed APies for auth
  1. Login
  2. reset password with old password
  3. reset password via email otp
  4. Refresh token
  5. Register user
  6. 
*/

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
  // if (newUser) {
  //   // notify user
  //   Notification.sendDirectSMSNotification(``, newUser.mobile);
  //   Notification.sendSMTPMail(
  //     "hello@shukran.com.bd",
  //     newUser.email,
  //     "Welcome to Shukran",
  //     `Welcome to Shukran, ${newUser.name}`
  //   );
  // }
  const userData = newUser.toJSON();
  delete userData.password;
  return userData;
};

const login = async (
  uid: string,
  password: string
): Promise<{
  _id: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}> => {
  const user = await UserModel.findOne({
    $or: [
      { email: uid, isDeleted: false },
      { phoneNumber: uid, isDeleted: false },
    ],
  })
    .select(
      "password _id name email attemptWrongPassword blockingInfo phoneNumber displayImage isVerified"
    )
    .exec();

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
const logout = async (id: string, res: Response): Promise<void> => {
  const user = await UserModel.findOne({ _id: id, isDeleted: false }).exec();
  if (!user) {
    throw new Error("User not found");
  }
  res.clearCookie("refreshToken");
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
      isDeleted: false,
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
): Promise<{ requestId: string }> => {
  return wrapWithSession(async (session) => {
    const user = await UserModel.findOne({
      $or: [
        { email: data?.uid, isDeleted: false },
        { mobile: data?.uid, isDeleted: false },
      ],
    })
      .select("+lastOtpRequest")
      .session(session);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User does not exist!");
    }

    if (data.channelType === PasswordResetChannelType.EMAIL && !user.email) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Email address is required for email password reset, but it is missing for this user."
      );
    }

    let isExistOTPSend = false;

    // Generate OTP and create OTP document in db
    const otpData = await OTPHelper(user._id as any, data.channelType);
    const [saveOtp] = await OTPModel.create([otpData.payload], { session });

    if (!saveOtp) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server error"
      );
    }

    if (data?.channelType === PasswordResetChannelType.EMAIL) {
      const variables = {
        name: user?.userName,
        otp: otpData.otp,
      };

      // const emailContent = Notification.generateEmailFromTemplate(
      //   loginOTPEmailTemplate,
      //   variables
      // );

      //   Notification.sendSMTPMail(
      //     "Shukran E Commerce<system@kernelkey.com>",
      //     user?.email,
      //     "Password Reset OTP",
      //     emailContent
      //   );
    }

    await session.commitTransaction();
    return { requestId: saveOtp?._id.toString() };
  });
};

const verifyOTP = async (data: { otp: string; requestId: string }) => {
  const otpData = await OTPModel.findOne({
    _id: data.requestId,
    status: true,
  });
  if (!otpData) {
    throw new ApiError(httpStatus.NOT_FOUND, "otp doesn't exist!");
  }

  const isVerified = await bcrypt.compare(data.otp, otpData?.otp);
  // console.log(doesExistOtp.otp, otp, isVerified)

  if (!isVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP Doesn't matched");
  }
  const isExpiredOTP = new Date(otpData?.expireTime) < new Date();
  if (isExpiredOTP) {
    throw new ApiError(httpStatus.GONE, "Expired OTP");
  }

  const updateOTPData = await OTPModel.findByIdAndUpdate(data.requestId, {
    status: false,
  });
  if (!updateOTPData) {
    throw new ApiError(httpStatus.CONFLICT, "Failed to update requestId!");
  }
  const generateJWT = JwtHelper.createToken(
    { requestId: otpData?._id, userId: otpData.userId.toString() },
    config.jwt.secret,
    "300000"
  );
  return {
    resetPasswordToken: generateJWT,
  };
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
    status: false,
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
        lastChangedPassword: new Date(),
      },
      { new: true, session }
    );
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to change Password!");
    }
    await OTPModel.findByIdAndDelete(token.otpId, session);
    // Send email to user
    // const variables = {
    //   name: user?.name,
    // }
    // const emailContent = Notification.generateEmailFromTemplate(
    //   changedPasswordInformEmailTemplate,
    //   variables
    // )

    // Notification.sendMail(
    //   'Quest OS<info@mindquest.studio>',
    //   user?.email,
    //   'Changed Password successfully',
    //   emailContent
    // )
    await session.commitTransaction();
    await session.endSession();
    return "Success";
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const verifyPhoneNumber = async (userId: string, otp: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }
  const otpData = await OTPModel.findOne({
    userId: userId,
    otp: otp,
    status: true,
  });
  if (!otpData) {
    throw new ApiError(httpStatus.NOT_FOUND, "OTP not found!");
  }
  const isExpiredOTP = new Date(otpData?.expireTime) < new Date();
  if (isExpiredOTP) {
    throw new ApiError(httpStatus.GONE, "Expired OTP");
  }
  const updateOTPData = await OTPModel.findByIdAndUpdate(otpData._id, {
    status: false,
  });
  if (!updateOTPData) {
    throw new ApiError(httpStatus.CONFLICT, "Failed to update requestId!");
  }
  return "Success";
};

// request Email number change
const requestEmailChange = async (
  userId: string,
  data: { newEmail: string }
): Promise<any> => {
  const user = await UserModel.findOne({ _id: userId, isDeleted: false });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }
  if (!user.email) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Email address is required for email password reset, but it is missing for this user."
    );
  }
  const checkNumberAlreadyExist = await UserModel.findOne({
    email: data.newEmail,
  });
  if (checkNumberAlreadyExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "The email you provided is already in use."
    );
  }
  const otp = generateOTP();
  const bcryptOtp = await bcrypt.hash(otp, Number(config.default_bcrypt_round));
  const time: any = new Date();
  const payload = {
    userId: user?._id,
    expireTime: time.getTime() + 300000,
    otp: bcryptOtp,
    status: true,
    update: {
      newEmail: data.newEmail,
    },
    channel: PasswordResetChannelType.EMAIL,
  };
  const saveOtp = await OTPModel.create(payload);

  if (!saveOtp) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Internal Server error"
    );
  }

  // send otp via new mail
  // const variables = {
  //   name: user.name,
  // };

  // const emailContent = Notification.generateEmailFromTemplate(
  //   ChangeEmailOTPTemplate,
  //   variables
  // );

  // Notification.sendMail(
  //   "Email verification OTP<hello@shukran.com.bd>",
  //   data.newEmail,
  //   "email verification otp",
  //   emailContent
  // );
  return { requestId: saveOtp?._id };
};

// Change Email
const changeEmail = async (
  userId: string,
  payload: { otp: string; requestId: string }
): Promise<string> => {
  const userInfo = await UserModel.findById(userId).select(
    "password email blockingInfo"
  );
  if (!userInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not doesn't exist.");
  }
  const optData = await OTPModel.findById(payload.requestId);
  if (!optData) {
    throw new ApiError(httpStatus.NOT_FOUND, "OTP data not found.");
  }

  const compareOTP = await bcrypt.compare(payload.otp, optData.otp);
  if (!compareOTP) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "OTP not matched");
  }
  const isExpiredOTP = new Date(optData?.expireTime) < new Date();
  if (isExpiredOTP) {
    throw new ApiError(httpStatus.GONE, "Expired OTP");
  }

  return wrapWithSession(async (session) => {
    const updateUserNumber = await UserModel.findByIdAndUpdate(
      userId,
      {
        email: optData.update.newEmail,
      },
      { session }
    );
    if (!updateUserNumber) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to update email."
      );
    }
    const deleteOtp = await OTPModel.findByIdAndDelete(payload.requestId, {
      session,
    });
    if (!deleteOtp) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Bad Request");
    }

    return "Success";
  });
};

const changePassword = async (
  userId: string,
  payload: IPasswordChangeWithOldPassword
): Promise<any> => {
  const { oldPassword, newPassword } = payload;
  if (oldPassword === newPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "New password can't be same as old password"
    );
  }
  const doesUserExist = await UserModel.findById(userId).select({
    password: 1,
  });
  if (!doesUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not Found");
  }
  const doesPasswordMatched = await UserModel.doesPasswordMatched(
    oldPassword,
    doesUserExist?.password
  );
  // checking old pass
  if (doesUserExist.password && !doesPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Old password doesn't match");
  }

  // Hash password
  const newHashPass = await bcrypt.hash(
    newPassword,
    Number(config.default_bcrypt_round)
  );
  const updateData = {
    password: newHashPass,
    lastChangedPassword: new Date(),
  };

  const updatePassword = await UserModel.findByIdAndUpdate(userId, updateData, {
    new: true,
  });

  if (!updatePassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to update Password");
  }
  return "Success";
};

export const AuthServices = {
  registerUser,
  login,
  logout,
  refreshToken,
  forgetPassword,
  resetPasswordViaResetPasswordToken,
  verifyOTP,
  changeEmail,
  requestEmailChange,
  changePassword,
};
