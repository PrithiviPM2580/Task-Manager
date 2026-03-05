import logger from "@/lib/logger.lib.js";
import {
  exportTasksReportService,
  exportUsersReportService,
} from "@/services/report.service.js";
import { successResponse } from "@/utils/success-response.util.js";
import type { Request, Response } from "express";

export const exportTasksReportController = async (
  req: Request,
  res: Response,
) => {
  await exportTasksReportService(res);

  logger.info(
    `Tasks report exported successfully for user ${req.user!.userId}`,
    {
      userId: req.user!.userId,
      label: "Report_Controller",
    },
  );

  successResponse(res, 200, "Tasks report exported successfully");
};

export const exportUsersReportController = async (
  req: Request,
  res: Response,
) => {
  await exportUsersReportService(res);

  logger.info(
    `Users report exported successfully for user ${req.user!.userId}`,
    {
      userId: req.user!.userId,
      label: "Report_Controller",
    },
  );

  successResponse(res, 200, "Users report exported successfully");
};
