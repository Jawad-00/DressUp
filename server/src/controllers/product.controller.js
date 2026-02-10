import { Product } from "../models/product.model.js";
import { productCreateSchema } from "../schemas/catalog.schema.js";
import { productUpdateSchema } from "../schemas/catalog.schema.js";

export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      q,
      size,
      minPrice,
      maxPrice,
      tag,
      featured,
      sort = "new",
      page = 1,
      limit = 12,
    } = req.query;

    const filter = { isActive: true };

    // Category filter (ObjectId)
    if (category) filter.categoryId = category;

    // Search by title (basic)
    if (q) filter.title = { $regex: q, $options: "i" };

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Featured filter
    if (typeof featured !== "undefined") {
      filter.isFeatured = featured === "true";
    }

    // Tag filter (single tag)
    if (tag) {
      filter.tags = tag;
    }

    // Size filter (checks variants array)
    if (size) {
      filter.variants = { $elemMatch: { size, stock: { $gt: 0 } } };
    }

    const sortMap = {
      new: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      title_asc: { title: 1 },
      title_desc: { title: -1 },
    };

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Product.find(filter)
        .populate("categoryId", "name slug")
        .sort(sortMap[sort] || sortMap.new)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};


export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate("categoryId", "name slug");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const parsed = productCreateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.errors });

    const exists = await Product.findOne({ slug: parsed.data.slug });
    if (exists) return res.status(409).json({ message: "Product slug already exists" });

    const product = await Product.create(parsed.data);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product removed (soft delete)", product });
  } catch (err) {
    next(err);
  }
};
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("categoryId", "name slug");
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    next(err);
  }
};
export const updateProduct = async (req, res, next) => {
  try {
    const parsed = productUpdateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.errors });

    // If slug is being updated, ensure uniqueness
    if (parsed.data.slug) {
      const existing = await Product.findOne({ slug: parsed.data.slug, _id: { $ne: req.params.id } });
      if (existing) return res.status(409).json({ message: "Product slug already exists" });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: parsed.data },
      { new: true, runValidators: true }
    ).populate("categoryId", "name slug");

    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};
export const adminGetProducts = async (req, res, next) => {
  try {
    const { q, category, isActive, sort = "new", page = 1, limit = 20 } = req.query;

    const filter = {};

    if (typeof isActive !== "undefined") {
      filter.isActive = isActive === "true";
    }
    if (category) filter.categoryId = category;
    if (q) filter.title = { $regex: q, $options: "i" };

    const sortMap = {
      new: { createdAt: -1 },
      old: { createdAt: 1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      title_asc: { title: 1 },
      title_desc: { title: -1 },
    };

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Product.find(filter)
        .populate("categoryId", "name slug")
        .sort(sortMap[sort] || sortMap.new)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};
export const setProductActive = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be boolean" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).populate("categoryId", "name slug");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    next(err);
  }
};
export const getFeaturedProducts = async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 6, 12);

  const items = await Product.find({ isActive: true, isFeatured: true })
    .populate("categoryId", "name slug")
    .sort({ createdAt: -1 })
    .limit(limit);

  res.json(items);
};
