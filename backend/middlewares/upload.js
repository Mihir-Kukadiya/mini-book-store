import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/CloudInary.js";

const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

let storage;

if (isCloudinaryConfigured) {
  try {
    storage = new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => {
        const params = {
          folder: "books",
          resource_type: "auto",
          allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
          public_id: `${Date.now()}-${file.originalname?.replace(/\s+/g, "-").replace(/\.[^/.]+$/, "") || "image"}`,
        };
        console.log("📤 Uploading to Cloudinary with params:", { ...params, public_id: params.public_id });
        return params;
      },
    });
    console.log("✅ Cloudinary storage initialized successfully");
  } catch (error) {
    console.error("❌ CloudinaryStorage initialization error:", error.message);
    console.error("Full error:", error);
    storage = multer.memoryStorage();
    console.warn("⚠️  Falling back to memory storage");
  }
} else {
  console.warn("⚠️  Cloudinary not configured - using memory storage");
  console.warn("⚠️  Images will not be saved. Set CLOUDINARY_* env variables to enable uploads.");
  storage = multer.memoryStorage();
}

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file) {
      return cb(null, true);
    }
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

export default upload;
