import express from "express";
import { AuthValidations } from "./auth.validation";
import { AuthController } from "./auth.controller";
import validateRequest from "../../../middlewares/validateRequest";
import auth from "../../../middlewares/auth";
import { UserController } from "../user/user.controller";
import { UserValidation } from "../user/user.validation";

const router = express.Router();

router.post(
  "/register",
  validateRequest(AuthValidations.RegisterValidations),
  AuthController.registerUser
);
router.post(
  "/login",
  validateRequest(AuthValidations.loginZodSchema),
  AuthController.login
);
router.get("/profile", auth(), UserController.getUserById);
router.put(
  "/profile",
  validateRequest(UserValidation.updateUserZodSchema),
  auth(),
  UserController.updateUser
);

// it will send reset link via email
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

router.post("/logout", auth(), AuthController.logout);
router.get("/refresh-token", AuthController.refreshToken);
export const AuthRoute = router;
