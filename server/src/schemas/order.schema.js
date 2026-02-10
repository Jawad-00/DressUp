import { z } from "zod";

export const orderCreateSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      titleSnapshot: z.string(),
      priceSnapshot: z.number().min(0),
      imageSnapshot: z.string().optional(),
      size: z.string(),
      qty: z.number().int().min(1),
    })
  ).min(1),

  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(7),
    address: z.string().min(5),
    city: z.string().min(2),
    country: z.string().min(2),
  }),
});
