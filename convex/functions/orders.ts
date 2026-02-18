import { query } from "../_generated/server";

export const listOrdersWithClient = query({
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();

    return await Promise.all(
      orders.map(async (order) => {
        const client = await ctx.db.get(order.clientId);

        return {
          ...order,
          client,
        };
      })
    );
  },
});
