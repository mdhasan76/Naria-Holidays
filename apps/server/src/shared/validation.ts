import { z } from "zod";

export const UserNameSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});
