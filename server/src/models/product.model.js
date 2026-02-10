import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    size: { type: String, required: true },     // S, M, L, XL
    stock: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },

    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: 0 },

    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },

    images: [{ type: String }], // URLs
    variants: [variantSchema],

    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
