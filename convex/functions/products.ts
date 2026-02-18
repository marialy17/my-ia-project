import { query } from "../_generated/server";

export const getProducts = query({
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const getActiveProducts = query({
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();

    return products.filter((p) => p.active);
  },
});
