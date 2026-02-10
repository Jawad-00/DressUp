import { Router } from "express";
import { uploadImage, uploadMultipleImages } from "../controllers/upload.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { deleteImage } from "../controllers/upload.controller.js";

const router = Router();

// Single image upload
router.post("/", requireAuth, requireAdmin, upload.single("image"), uploadImage);

// Multiple images upload (max 6)
router.post(
  "/multiple",
  requireAuth,
  requireAdmin,
  upload.array("images", 6),
  uploadMultipleImages
);
router.delete("/", requireAuth, requireAdmin, deleteImage);

export default router;
