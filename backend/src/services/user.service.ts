import APIError from "@/lib/api-error.lib.js";
import logger from "@/lib/logger.lib.js";
import {
  findAllUsersByRole,
  findUserById,
  getDocumentTasksCount,
} from "@/repositories/user.repository.js";

export const getAllUsersService = async () => {
  const users = await findAllUsersByRole();

  if (!users) return { users: [] };

  try {
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const taskCounts = await getDocumentTasksCount(String(user._id));

        return {
          ...user,
          taskCounts,
        };
      }),
    );

    return { users: usersWithTaskCounts };
  } catch (error) {
    logger.error("Failed to fetch users with task counts", {
      label: "User_Service",
      error: error instanceof Error ? error.message : String(error),
    });

    throw new APIError(500, "Failed to fetch users");
  }
};

export const getUserByIdService = async (id: string) => {
  const user = await findUserById(id);

  if (!user) {
    logger.error("User not found with ID", {
      label: "User_Service",
      userId: id,
    });
    throw new APIError(404, "User not found");
  }

  return { user };
};
