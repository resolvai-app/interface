import { google } from "@ai-sdk/google";
import { streamText } from "ai";

// 允许流式响应最多30秒
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.0-flash"),
    messages,
  });

  return result.toDataStreamResponse();
}
