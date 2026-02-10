import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    titleSnapshot: String,
    priceSnapshot: Number,
    imageSnapshot: String,
    size: String,
    qty: Number,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    items: [orderItemSchema],

    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      country: String,
    },

    subtotal: Number,
    shippingCost: Number,
    total: Number,

    status: {
      type: String,
      enum: ["PLACED", "PACKED", "SHIPPED", "DELIVERED"],
      default: "PLACED",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
