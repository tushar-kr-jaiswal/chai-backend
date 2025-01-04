import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        // file has been uploaded successfully
        console.log(`File has been uploaded successfully at ${response.url}`);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
};

const deleteImageFromCloudinary = async (oldFilePath) => {
    try {
        if (!oldFilePath) {
            throw new ApiError(400, "Not found any filepath to delete.");
        }

        const parts = oldFilePath?.split("/");
        const lastPart = parts[parts.length - 1];
        let publicId = lastPart.split(".")[0]; // to remove .png from -> avatar.png

        if (parts[parts.length - 2] !== "upload") {
            publicId = `${parts[parts.length - 2]}/${publicId}`;
        }

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
        });

        if (result.result !== "ok") {
            throw new ApiError(
                500,
                "Unable to destroy file due to technical error."
            );
        }
    } catch (error) {
        throw new ApiError(400, " Unable to delete. ");
    }
};

export { uploadOnCloudinary, deleteImageFromCloudinary };
