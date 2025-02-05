import express from "express";
import { AuthValidations } from "./auth.validation";
import { AuthController } from "./auth.controller";
import validateRequest from "../../../middlewares/validateRequest";
import auth from "../../../middlewares/auth";

const router = express.Router();
router.post(
  "/login",
  validateRequest(AuthValidations.loginZodSchema),
  AuthController.login
);

router.post(
  "/register",
  validateRequest(AuthValidations.RegisterValidations),
  AuthController.registerUser
);

router.post("/logout", auth(), AuthController.logout);
router.post(
  "/forgot-password",
  validateRequest(AuthValidations.forgetPasswordZodSchema),
  AuthController.forgetPassword
);
router.post(
  "/reset-password",
  validateRequest(AuthValidations.resetPasswordZodSchema),
  AuthController.resetPasswordViaResetPasswordToken
);
router.post(
  "/verify-otp",
  validateRequest(AuthValidations.verifyOTPZodSchema),
  AuthController.verifyOTP
);
router.get("/refresh-token", AuthController.refreshToken);
router.post(
  "/request-change-email/:userId",
  auth(),
  // CheckIfSelf,
  validateRequest(AuthValidations.requestEmailChangeZodSchema),
  AuthController.requestEmailChange
);
router.patch(
  "/change-email/:userId",
  auth(),
  // CheckIfSelf,
  validateRequest(AuthValidations.changeEmailZodSchema),
  AuthController.changeEmail
);
router.patch(
  "/change-password/:userId",
  auth(),
  // CheckIfSelf,
  validateRequest(AuthValidations.passwordChangeWithOldPassword),
  AuthController.changePassword
);
export const AuthRoute = router;
