import { NextResponse } from "next/server";
import twilio from "twilio";

if (!process.env.TWILIO_ACCOUNT_SID) throw new Error("TWILIO_ACCOUNT_SID is required");
if (!process.env.TWILIO_AUTH_TOKEN) throw new Error("TWILIO_AUTH_TOKEN is required");
if (!process.env.TWILIO_PHONE_NUMBER) throw new Error("TWILIO_PHONE_NUMBER is required");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

// 优先使用 Vercel 的 URL
const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXT_PUBLIC_BASE_URL;

if (!baseUrl) throw new Error("Either VERCEL_URL or NEXT_PUBLIC_BASE_URL is required");

const client = twilio(accountSid, authToken);

export async function POST(request: Request) {
  try {
    const { to } = await request.json();

    if (!to) {
      return NextResponse.json({ error: "电话号码不能为空" }, { status: 400 });
    }

    // 发起呼叫
    const call = await client.calls.create({
      to,
      from: twilioNumber,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/twilio/voice`,
    });

    return NextResponse.json({
      callSid: call.sid,
      status: call.status,
    });
  } catch (error) {
    console.error("Twilio 呼叫错误:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "未知错误" },
      { status: 500 }
    );
  }
}
