import { z } from "zod";
import { RoleName } from "../../../shared/interface";

const RegisterValidations = z.object({
  body: z
    .object({
      name: z.object({
        firstName: z
          .string({
            required_error: "First name is required",
          })
          .optional(),
        lastName: z.string({
          required_error: "Last name is required",
        }),
      }),
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
      role: z
        .nativeEnum(RoleName, {
          required_error: "Role is required",
        })
        .optional(),
      phoneNumber: z
        .string({
          required_error: "Phone number is required",
        })
        .length(11, {
          message: "Phone number must be exactly 11 characters long",
        })
        .optional(),
      email: z
        .string({
          required_error: "Email is required",
        })
        .email({
          message: "Email must be a valid email address",
        })
        .optional(),
    })
    .refine((data) => data.email || data.phoneNumber, {
      message: "Either email or phone number must be provided",
      path: ["email", "phoneNumber"], // Include both paths to show error on either field
    }),
});

const loginZodSchema = z.object({
  body: z.object({
    uid: z.string({
      required_error: "uid is Required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});
const loginViaOTPZodSchema = z.object({
  body: z.object({
    otp: z.string({
      required_error: "otp is required",
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

const changePasswordZodSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: "Old Password is Required",
    }),
    newPassword: z
      .string({
        required_error: "New password is required",
      })
      .length(6),
  }),
});
const forgetPasswordZodSchema = z.object({
  body: z.object({
    uid: z.string(),
    channelType: z.enum(["sms", "email"]),
  }),
});

const verifyOTPZodSchema = z.object({
  body: z.object({
    requestId: z.string(),
    otp: z.string().length(6),
    // userId: z.string(),
  }),
});

const resetPasswordZodSchema = z.object({
  body: z.object({
    token: z.string(),
    newPassword: z.string().min(8),
  }),
});

const changeMobileNumberZodSchema = z.object({
  body: z.object({
    otp: z
      .string({
        required_error: "opt is required",
      })
      .length(6),
    requestId: z.string({
      required_error: "requestId is required",
    }),
  }),
});
const changeEmailZodSchema = z.object({
  body: z.object({
    otp: z
      .string({
        required_error: "opt is required",
      })
      .length(6),
    requestId: z.string({
      required_error: "requestId is required",
    }),
  }),
});
const requestMobileNumberChangeZodSchema = z.object({
  body: z.object({
    newNumber: z
      .string({
        required_error: "new number is required",
      })
      .length(11, {
        message: "New Mobile number must be exactly 11 characters long",
      }),
  }),
});
const requestEmailChangeZodSchema = z.object({
  body: z.object({
    newEmail: z
      .string({
        required_error: "new number is required",
      })
      .email(),
  }),
});

const passwordChangeWithOldPassword = z.object({
  body: z.object({
    oldPassword: z.string(),
    newPassword: z.string(),
  }),
});

export const AuthValidations = {
  RegisterValidations,
  loginZodSchema,
  refreshTokenZodSchema,
  changePasswordZodSchema,
  forgetPasswordZodSchema,
  resetPasswordZodSchema,
  loginViaOTPZodSchema,
  verifyOTPZodSchema,
  changeMobileNumberZodSchema,
  requestMobileNumberChangeZodSchema,
  requestEmailChangeZodSchema,
  changeEmailZodSchema,
  passwordChangeWithOldPassword,
};
