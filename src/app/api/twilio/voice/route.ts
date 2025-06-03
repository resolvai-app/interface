import { NextResponse } from "next/server";
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";

// 优先使用 Vercel 的 URL
const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXT_PUBLIC_BASE_URL;

if (!baseUrl) throw new Error("Either VERCEL_URL or NEXT_PUBLIC_BASE_URL is required");

export async function POST() {
  try {
    const twiml = new VoiceResponse();
    twiml.say(
      {
        voice: "alice",
        language: "zh-CN",
      },
      "你好，我是 AI 助手，很高兴为你服务。"
    );

    return new NextResponse(twiml.toString(), {
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    console.error("Twilio 语音响应错误:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "未知错误" },
      { status: 500 }
    );
  }
}
