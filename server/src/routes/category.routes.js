import { Router } from "express";
import {
  getCategories,
  createCategory,
  adminGetCategories,
  updateCategory,
  setCategoryActive,
  deleteCategory,
} from "../controllers/category.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = Router(); // ✅ you were missing this

// Public
router.get("/", getCategories);

// Admin
router.get("/admin/all", requireAuth, requireAdmin, adminGetCategories);
router.post("/", requireAuth, requireAdmin, createCategory);
router.patch("/:id", requireAuth, requireAdmin, updateCategory);
router.patch("/:id/active", requireAuth, requireAdmin, setCategoryActive);
router.delete("/:id", requireAuth, requireAdmin, deleteCategory);

export default router;
