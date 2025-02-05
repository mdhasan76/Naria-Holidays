import mongoose from "mongoose";
import { errorLogger, successLogger } from "../shared/logger";
import { config } from "../config";
export const connectDatabase = async () => {
  try {
    await mongoose.connect(config.database_string as string);
    successLogger.info("Database connected successfully. ✅");
  } catch (error) {
    errorLogger.error("Error while connecting database: ", error);
  }
};
