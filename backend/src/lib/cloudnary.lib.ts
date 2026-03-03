import cloudinaryConfig from "@/config/cloudnary.config.js";
import logger from "./logger.lib.js";
import APIError from "./api-error.lib.js";

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = "profile",
): Promise<{ url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinaryConfig.uploader.upload_stream(
      {
        folder,
        resource_type: "auto", // better than forcing png
      },
      (error: Error | null, result: any) => {
        if (error) {
          logger.error("Cloudinary upload failed", { error });
          return reject(new APIError(500, "Cloudinary upload failed"));
        }

        if (!result?.secure_url || !result.public_id) {
          return reject(
            new APIError(500, "Cloudinary upload failed: Invalid response"),
          );
        }

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    stream.end(fileBuffer);
  });
};
