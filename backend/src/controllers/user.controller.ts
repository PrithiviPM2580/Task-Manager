import { getAllUsersService } from "@/services/user.service.js";
import { successResponse } from "@/utils/success-response.util.js";
import type { Request, Response } from "express";

export const getAllUsersController = async (req: Request, res: Response) => {
    const { users } = await getAllUsersService();

    successResponse(res, 200, "Users fetched successfully", {
        users,
    });
};