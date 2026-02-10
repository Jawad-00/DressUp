import { Router } from "express";
import {
  getProducts,
  getProductBySlug,
  getProductById,
  adminGetProducts,
  createProduct,
  updateProduct,
  setProductActive,
  deleteProduct,
  getFeaturedProducts,
} from "../controllers/product.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = Router();

/**
 * PUBLIC ROUTES
 * - These routes are accessible to everyone (no login required)
 */
router.get("/", getProducts);

/**
 * ADMIN ROUTES (must come BEFORE "/:slug")
 * - Because "/:slug" would otherwise catch "admin" or "id" as a slug.
 */

// Admin: list all products (active + inactive) + filters/pagination
router.get("/admin/all", requireAuth, requireAdmin, adminGetProducts);

router.get("/featured", getFeaturedProducts);

// Admin: get single product by Mongo ID (for edit screens)
router.get("/id/:id", requireAuth, requireAdmin, getProductById);

// Public: get product by slug (must be AFTER admin/id routes)
router.get("/:slug", getProductBySlug);


/**
 * ADMIN MUTATION ROUTES
 * - Create/Update/Delete product
 */

// Create product
router.post("/", requireAuth, requireAdmin, createProduct);

// Update product (PATCH: update only provided fields)
router.patch("/:id", requireAuth, requireAdmin, updateProduct);

// Activate / Deactivate product (soft toggle)
router.patch("/:id/active", requireAuth, requireAdmin, setProductActive);

// Soft delete (sets isActive=false)
router.delete("/:id", requireAuth, requireAdmin, deleteProduct);

export default router;
