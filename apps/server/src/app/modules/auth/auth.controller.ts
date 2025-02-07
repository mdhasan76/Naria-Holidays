import httpStatus from "http-status";
import { AuthServices } from "./auth.services";
import { CookieOptions, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/customResponse";
import { config } from "../../../config";
import { JwtHelper } from "../../../helpers/jwtHelpers";

const login = catchAsync(async (req, res) => {
  const result = await AuthServices.login(req.body.email, req.body.password);
  const { accessToken, refreshToken, ...rest } = result;
  if (refreshToken) {
    const cookieOptions: CookieOptions = {
      secure: config.env === "production",
      httpOnly: false,

      // domain: "localhost",
      expires: new Date(Date.now() + 1000 * 3600 * 24),
    };
    if (config.env === "production") {
      cookieOptions.sameSite = "none";
    }

    const enCodeUserDocument = JwtHelper.createToken(
      rest,
      config.jwt.secret,
      config.jwt.expires_in
    );
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("raw_idToken", enCodeUserDocument, cookieOptions);
  }
  // set refresh token into cookie

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged in successfully!",
    data: {
      accessToken,
      user: rest,
    },
  });
});

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.registerUser(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User registered successfully!",
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result: any = await AuthServices.refreshToken(refreshToken);
  const { accessToken, user, ...rest } = result;
  // set refresh token into cookie

  const cookieOptions: CookieOptions = {
    secure: config.env === "production",
    httpOnly: false,
    // domain: 'localhost',

    expires: new Date(Date.now() + 900000),
  };
  if (config.env === "production") {
    cookieOptions.sameSite = "none";
  }

  // res.cookie("refreshToken", refreshToken, cookieOptions);
  const enCodeUserDocument = JwtHelper.createToken(
    rest,
    config.jwt.secret,
    config.jwt.expires_in
  );
  res.cookie("refreshToken", rest.refreshToken, cookieOptions);
  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("raw_idToken", enCodeUserDocument, cookieOptions);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Refresh Token updated successfully !",
    data: { accessToken, user },
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.forgetPassword(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Forget password checked successfully!",
    data: result,
  });
});
const resetPasswordViaResetPasswordToken = catchAsync(
  async (req: Request, res: Response) => {
    const resetPasswordToken = req.body.token;
    const result = await AuthServices.resetPasswordViaResetPasswordToken(
      resetPasswordToken as any,
      req.body.newPassword
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password changed successfully!",
      data: result,
    });
  }
);

export const AuthController = {
  login,
  registerUser,
  refreshToken,
  forgetPassword,
  resetPasswordViaResetPasswordToken,
};
