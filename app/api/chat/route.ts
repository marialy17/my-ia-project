// import { google } from "@ai-sdk/google";
// import { generateText } from "ai";

// interface Body {
//   message: string;
// }

// export async function POST(req: Request): Promise<Response> {
//   const body = (await req.json()) as Body;

//   const result = await generateText({
//     model: google("gemini-3-flash-preview"),
//     prompt: body.message,
//   });

//   return Response.json({
//     content: result.text,
//   });
// }

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  const { message } = await req.json();

  // 🔥 traes datos reales
  const clients = await convex.query(api.functions.clients.getClients);
  const orders = await convex.query(api.functions.orders.listOrdersWithClient);

  // 🔥 construyes contexto
  const context = `
Clientes:
${JSON.stringify(clients)}

Ventas:
${JSON.stringify(orders)}
`;

  // 🔥 se lo pasas a Gemini
  const result = await generateText({
    model: google("gemini-3-flash-preview"),
    prompt: `
Usa esta información para responder:

${context}

Pregunta del usuario:
${message}
`,
  });

  return Response.json({
    content: result.text,
  });
}

