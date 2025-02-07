import { z } from "zod";

const updateUserZodSchema = z.object({
  body: z.object({
    userName: z.string().optional(),
    displayImage: z.string().optional(),
  }),
});

export const UserValidation = { updateUserZodSchema };
