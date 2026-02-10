import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.json({ status: "ok", project: "DressUp backend running" });
});

export default router;
