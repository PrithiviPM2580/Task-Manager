import express, { type Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import corsOptions from "./lib/cors.lib.js";
import morganOptions from "./lib/morgan.lib.js";
import globalErrorHandler from "./middlewares/global-error-handler.middleware.js";
import routes from "@/routes/index.route.js";

// Create Express app
const app: Express = express();

// Middleware
app.use(helmet());
app.use(morganOptions);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

// Routes
app.use(routes);

//Error handling middleware
app.use(globalErrorHandler);

export default app;
