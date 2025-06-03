import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export async function POST(request: Request) {
  try {
    const { callSid } = await request.json();

    if (!callSid) {
      return NextResponse.json({ error: "呼叫 ID 不能为空" }, { status: 400 });
    }

    const call = await client.calls(callSid).update({ status: "canceled" });

    return NextResponse.json({
      success: true,
      status: call.status,
    });
  } catch (error) {
    console.error("Twilio 取消呼叫错误:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "未知错误" },
      { status: 500 }
    );
  }
}
