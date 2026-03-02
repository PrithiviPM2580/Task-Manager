import app from "./app.js";
import connectToDatabase from "./config/db.config.js";
import logger from "./lib/logger.lib.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      logger.info(`Server is running in http://localhost:${PORT}`, {
        label: "Server_Startup",
      });
    });
  } catch (error) {
    logger.error("Failed to start the server:", {
      label: "Server_Startup",
      error,
    });
    process.exit(1);
  }
};

startServer();
