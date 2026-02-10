import { z } from "zod";

export const orderStatusSchema = z.object({
  status: z.enum(["PLACED", "PACKED", "SHIPPED", "DELIVERED"]),
});
