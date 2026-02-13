import { google } from "@ai-sdk/google";
import { generateText } from "ai";

interface Body {
  message: string;
}

export async function POST(req: Request): Promise<Response> {
  const body = (await req.json()) as Body;

  const result = await generateText({
    model: google("gemini-3-flash-preview"),
    prompt: body.message,
  });

  return Response.json({
    content: result.text,
  });
}
