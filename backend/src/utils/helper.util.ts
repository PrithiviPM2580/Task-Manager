import cloudinaryConfig from "@/config/cloudnary.config.js";
import logger from "@/lib/logger.lib.js";

export const deleteFromCloudinary = async (
  publicId?: string,
): Promise<boolean> => {
  if (!publicId) return false;

  try {
    const result = await cloudinaryConfig.uploader.destroy(publicId);

    // Cloudinary returns { result: "ok" } on success
    if (result.result !== "ok") {
      logger.warn("Cloudinary deletion failed", {
        publicId,
        result,
      });
      return false;
    }

    return true;
  } catch (error) {
    logger.error("Cloudinary deletion error", {
      publicId,
      error,
    });
    return false;
  }
};
