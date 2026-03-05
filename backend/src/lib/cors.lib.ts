import type { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: process.env.CORS_ORIGIN! || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

export default corsOptions;
