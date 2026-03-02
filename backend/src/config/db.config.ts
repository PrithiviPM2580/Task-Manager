import logger from "@/lib/logger.lib.js";
import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    logger.info("Connected to MongoDB successfully", {
      label: "Database_Config",
    });
  } catch (error) {
    logger.error("Error connecting to MongoDB:", {
      label: "Database_Config",
      error,
    });
    throw error;
  }
};

export default connectToDatabase;
