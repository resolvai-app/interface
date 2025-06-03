import { NextResponse } from "next/server";

interface CallStatus {
  callSid: string;
  callStatus: string;
  recordingUrl: string | null;
  duration: string | null;
  errorCode: string | null;
  errorMessage: string | null;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // 验证必要参数
    const callSid = formData.get("CallSid");
    if (!callSid) {
      throw new Error("CallSid is required");
    }

    const status: CallStatus = {
      callSid: callSid as string,
      callStatus: formData.get("CallStatus") as string,
      recordingUrl: formData.get("RecordingUrl") as string | null,
      duration: formData.get("CallDuration") as string | null,
      errorCode: formData.get("ErrorCode") as string | null,
      errorMessage: formData.get("ErrorMessage") as string | null,
    };

    // 结构化日志记录
    console.log("Call status update:", {
      timestamp: new Date().toISOString(),
      ...status,
      hasRecording: !!status.recordingUrl,
      hasError: !!(status.errorCode || status.errorMessage),
    });

    // TODO: 更新数据库中的通话状态
    // TODO: 处理录音文件
    // TODO: 发送通知（如果需要）

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      callSid: status.callSid,
      status: status.callStatus,
    });
  } catch (error) {
    console.error("Status callback error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: "状态更新失败",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
