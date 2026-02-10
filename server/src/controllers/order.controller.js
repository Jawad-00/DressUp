import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { orderCreateSchema } from "../schemas/order.schema.js";
import { orderStatusSchema } from "../schemas/orderStatus.schema.js";

export const createOrder = async (req, res, next) => {
  try {
    const parsed = orderCreateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.errors });

    const { items, shippingAddress } = parsed.data;

    let subtotal = 0;

    // Validate stock
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: "Product not found" });

      const variant = product.variants.find(v => v.size === item.size);
      if (!variant || variant.stock < item.qty) {
        return res.status(400).json({ message: `Out of stock: ${item.titleSnapshot}` });
      }

      subtotal += item.priceSnapshot * item.qty;
    }

    // Reduce stock
    for (const item of items) {
      await Product.updateOne(
        { _id: item.productId, "variants.size": item.size },
        { $inc: { "variants.$.stock": -item.qty } }
      );
    }

    const shippingCost = 0;
    const total = subtotal + shippingCost;

    const order = await Order.create({
      userId: req.user._id,
      items,
      shippingAddress,
      subtotal,
      shippingCost,
      total,
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// ADMIN
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const parsed = orderStatusSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.errors });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: parsed.data.status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    next(err);
  }
};
