import dotenv from "dotenv";
import path from "path";
/* This code is using the `dotenv` package to load environment variables from a `.env` file located in
the root directory of the project. process.cwd() means the root directory */
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8080,
  database_string: process.env.DATABASE_STRING,
  default_member_pass: process.env.DEFAULT_MEMBER_PASS,
  default_manager_pass: process.env.DEFAULT_MANAGER_PASS,
  default_bcrypt_round: process.env.BCRYPT_SALT_ROUNDS,

  jwt: {
    secret: process.env.JWT_SECRET,
    refresh: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
};
