import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// 验证请求体的schema
const TokenRequestSchema = z.object({
    uses: z.number().optional().default(1),
    expireTimeMinutes: z.number().optional().default(30),
    newSessionExpireTimeMinutes: z.number().optional().default(1),
});

// 响应schema
const TokenResponseSchema = z.object({
    token: z.string(),
});

export type TokenRequest = z.infer<typeof TokenRequestSchema>;
export type TokenResponse = z.infer<typeof TokenResponseSchema>;

export async function POST(request: NextRequest) {
    try {
        // 解析请求体
        const body = await request.json();
        const validatedData = TokenRequestSchema.parse(body);

        // 创建Google GenAI客户端
        const client = new GoogleGenAI({});

        // 计算过期时间
        const expireTime = new Date(Date.now() + validatedData.expireTimeMinutes * 60 * 1000).toISOString();
        const newSessionExpireTime = new Date(Date.now() + validatedData.newSessionExpireTimeMinutes * 60 * 1000).toISOString();

        // 创建临时token
        const authToken = await client.authTokens.create({
            config: {
                uses: validatedData.uses,
                expireTime: expireTime,
                newSessionExpireTime: newSessionExpireTime,
                httpOptions: { apiVersion: 'v1alpha' },
            },
        });

        // 验证响应
        const response: TokenResponse = {
            token: authToken.name ?? '',
        };

        const validatedResponse = TokenResponseSchema.parse(response);

        return NextResponse.json(validatedResponse, { status: 200 });
    } catch (error) {
        console.error("Error creating auth token:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid request data", details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create auth token" },
            { status: 500 }
        );
    }
} 