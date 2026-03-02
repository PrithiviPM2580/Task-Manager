import { Router } from "express";
import authRouter from "./auth.route.js";

const router: Router = Router();

router.route("/").get((_req, res) => {
  res.json({ message: "Welcome to the Task Manager API!" });
});

router.route("/health").get((_req, res) => {
  res.json({ status: "OK", uptime: process.uptime() });
});

router.use("/api/auth", authRouter);

router.use("*", (_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default router;
