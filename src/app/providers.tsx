"use client";

import { ChatStateProvider } from "@/contexts/ChatStateContext";
import { LiveAPIProvider } from "@/contexts/LiveAPIContext";
import { getWsUrl } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <LiveAPIProvider options={{ url: getWsUrl() }}>
      <QueryClientProvider client={queryClient}>
        <ChatStateProvider>{children}</ChatStateProvider>
      </QueryClientProvider>
    </LiveAPIProvider>
  );
}
