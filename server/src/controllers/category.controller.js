import { Category } from "../models/category.model.js";
import { categoryCreateSchema, categoryUpdateSchema } from "../schemas/catalog.schema.js";
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const parsed = categoryCreateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.errors });

    const exists = await Category.findOne({ slug: parsed.data.slug });
    if (exists) return res.status(409).json({ message: "Category slug already exists" });

    const category = await Category.create(parsed.data);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

export const adminGetCategories = async (req, res, next) => {
  try {
    const { q, isActive, sort = "new" } = req.query;

    const filter = {};
    if (typeof isActive !== "undefined") filter.isActive = isActive === "true";
    if (q) filter.name = { $regex: q, $options: "i" };

    const sortMap = {
      new: { createdAt: -1 },
      old: { createdAt: 1 },
      name_asc: { name: 1 },
      name_desc: { name: -1 },
    };

    const categories = await Category.find(filter).sort(sortMap[sort] || sortMap.new);
    res.json(categories);
  } catch (err) {
    next(err);
  }
};
export const updateCategory = async (req, res, next) => {
  try {
    const parsed = categoryUpdateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.errors });

    // slug uniqueness check (only if slug is being updated)
    if (parsed.data.slug) {
      const existing = await Category.findOne({
        slug: parsed.data.slug,
        _id: { $ne: req.params.id },
      });
      if (existing) return res.status(409).json({ message: "Category slug already exists" });
    }

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: parsed.data },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Category not found" });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const setCategoryActive = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be boolean" });
    }

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Category not found" });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};
export const deleteCategory = async (req, res, next) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category removed (soft delete)", category: updated });
  } catch (err) {
    next(err);
  }
};
