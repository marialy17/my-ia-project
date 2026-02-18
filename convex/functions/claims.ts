import { query } from "../_generated/server";

export const listClaimWithClientAndOrder = query({
  handler: async (ctx) => {
    const claims = await ctx.db.query("claims").collect();

    return await Promise.all(
      claims.map(async (claim) => {
        const client = await ctx.db.get(claim.clientId);
        const order = await ctx.db.get(claim.orderId);

        return {
          ...claim,
          client,
          order,
        };
      })
    );
  },
});
