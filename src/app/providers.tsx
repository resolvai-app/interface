"use client";

import { LiveAPIProvider } from "@/contexts/LiveAPIContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LiveAPIProvider
      options={{ url: process.env.NEXT_PUBLIC_AI_LIVE_URL ?? "ws://localhost:3000" }}
    >
      {children}
    </LiveAPIProvider>
  );
}
