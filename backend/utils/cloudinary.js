import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "backend/config/config.env" });

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload file
export const upload_file = async (file, folder) => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            resource_type: "auto",
            folder
        });
        return {
            public_id: result.public_id,
            url: result.url,
        };
    } catch (error) {
        throw new Error(`File upload failed: ${error.message}`);
    }
};

// Delete file
export const delete_file = async (file) => {
    try {
        const result = await cloudinary.uploader.destroy(file);

        if (result.result === "ok") {
            return true; // File deleted successfully
        } else if (result.result === "not found") {
            throw new Error('File not found on Cloudinary');
        } else {
            throw new Error(`Cloudinary deletion failed: ${result.result}`);
        }
    } catch (error) {
        throw new Error(`Error deleting file: ${error.message}`);
    }
};
