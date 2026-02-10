import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = Router();

// Any logged in user
router.get("/me", requireAuth, (req, res) => {
  res.json({ message: "You are authenticated", user: req.user });
});

// Only admin
router.get("/admin", requireAuth, requireAdmin, (req, res) => {
  res.json({ message: "Welcome Admin", user: req.user });
});

export default router;
