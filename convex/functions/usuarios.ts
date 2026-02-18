import { query } from "../_generated/server";
import { v } from "convex/values";

export const obtenerUsuarios = query({
  handler: async (ctx) => {
    return await ctx.db.query("usuarios").collect();
  },
});

export const getUserByFullName = query({
  args: {
    nombre: v.string(),
    apellido: v.string(),
  },
  handler: async (ctx, { nombre, apellido }) => {
    const users = await ctx.db.query("usuarios").collect();

    return (
      users.find(
        (u) => u.nombre === nombre && u.apellido === apellido
      ) ?? null
    );
  },
});
