import { z } from "zod";

const UserSchema = z.object({
  name: z.string(),
  password: z.string(),
  displayImage: z.string(),
  phoneNumber: z.string(),
  email: z.string().email(),
});

export default UserSchema;
