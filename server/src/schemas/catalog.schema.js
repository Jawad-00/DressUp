import { z } from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const productCreateSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),

  price: z.number().min(0),
  compareAtPrice: z.number().optional(),

  categoryId: z.string().min(10),

  images: z.array(z.string()).optional(),

  variants: z.array(
    z.object({
      size: z.string().min(1),
      stock: z.number().int().min(0),
    })
  ).optional(),

  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const productUpdateSchema = productCreateSchema.partial();
export const categoryUpdateSchema = categoryCreateSchema.partial();
