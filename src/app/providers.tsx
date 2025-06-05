"use client";

import { LiveAPIProvider } from "@/contexts/LiveAPIContext";
import { getWsUrl } from "@/lib/utils";

export function Providers({ children }: { children: React.ReactNode }) {
  return <LiveAPIProvider options={{ url: getWsUrl() }}>{children}</LiveAPIProvider>;
}
