"use client";
import { useChatStore } from "@/hooks/store/useChatStore";
import { Chat } from "@/types";
import { Message } from "@ai-sdk/react";
import { createContext, FC, ReactNode, useContext } from "react";

type ChatStateContextType = {
  selectedChatId: string | null;
  setSelectedChatId: (chatId: string | null) => void;
  chats: Chat[];
  upsertChat: (chat: Partial<Chat>) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  fetchChats: () => Promise<Chat[] | undefined>;
  saveMessages: (chatId: string, messages: Message[]) => void;
  syncMessages: (chatId: string, setMessages: (messages: Message[]) => void) => void;
};

const ChatStateContext = createContext<ChatStateContextType | undefined>(undefined);

export const ChatStateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const chatStore = useChatStore();
  return <ChatStateContext.Provider value={chatStore}>{children}</ChatStateContext.Provider>;
};

export const useChatStateContext = () => {
  const context = useContext(ChatStateContext);
  if (!context) {
    throw new Error("useChatStateContext must be used wihin a ChatStateProvider");
  }
  return context;
};
