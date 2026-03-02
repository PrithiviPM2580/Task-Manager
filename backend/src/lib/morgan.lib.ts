import morgan from "morgan";
import logger from "./logger.lib.js";

const nodeEnv = process.env.NODE_ENV ?? "development";
const morganFormat = nodeEnv === "production" ? "combined" : "dev";

const morganOptions = morgan(morganFormat, {
  stream: {
    write: (message: string) => {
      logger.info(message.trim(), { label: "HTTP" });
    },
  },
  skip: () => nodeEnv === "test",
});

export default morganOptions;
