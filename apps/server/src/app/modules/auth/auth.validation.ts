import { z } from "zod";
import { RoleName } from "../../../shared/interface";

const RegisterValidations = z.object({
  body: z.object({
    userName: z.string({ required_error: "userName is required" }),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, {
        message: "Password must be at least 6 characters long",
      }),
    displayImage: z
      .string({
        required_error: "Display image is required",
      })
      .url({
        message: "Display image must be a valid URL",
      })
      .optional(),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email({
        message: "Email must be a valid email address",
      }),
  }),
});

const loginZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "email is Required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "RefreshToken is Required",
    }),
  }),
});

const forgetPasswordZodSchema = z.object({
  body: z.object({
    uid: z.string(),
    channelType: z.enum(["sms", "email"]),
  }),
});

const resetPasswordZodSchema = z.object({
  body: z.object({
    token: z.string(),
    newPassword: z.string().min(8),
  }),
});

export const AuthValidations = {
  RegisterValidations,
  loginZodSchema,
  refreshTokenZodSchema,
  forgetPasswordZodSchema,
  resetPasswordZodSchema,
};
