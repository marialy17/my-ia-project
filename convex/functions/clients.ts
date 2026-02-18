import { query } from "../_generated/server";
import { v } from "convex/values";

export const getClients = query({
  handler: async (ctx) => {
    return await ctx.db.query("clients").collect();
  },
});

export const getClientByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
    const clients = await ctx.db.query("clients").collect();

    return clients.find((c) => c.email === email) ?? null;
  },
});
