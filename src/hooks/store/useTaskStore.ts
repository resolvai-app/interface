"use client";
import { Chat } from "@/types";
import { create } from "zustand";

interface ChatState {
  chats: Chat[];
  selectedChatId: string | null;
  setChats: (chats: Chat[]) => void;
  setSelectedChatId: (chatId: string | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  selectedChatId: null,
  setChats: (chats) => {
    set({ chats });
    // 只在客户端保存到 localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("chats", JSON.stringify(chats));
    }
  },
  setSelectedChatId: (chatId) => {
    set({ selectedChatId: chatId });
    // 只在客户端保存到 localStorage
    if (typeof window !== "undefined") {
      if (chatId) {
        localStorage.setItem("selectedChatId", chatId);
      } else {
        localStorage.removeItem("selectedChatId");
      }
    }
  },
}));

// 在客户端初始化时加载数据
if (typeof window !== "undefined") {
  const savedChats = localStorage.getItem("chats");
  const savedSelectedChatId = localStorage.getItem("selectedChatId");

  if (savedChats) {
    useChatStore.getState().setChats(JSON.parse(savedChats));
  }

  if (savedSelectedChatId) {
    useChatStore.getState().setSelectedChatId(savedSelectedChatId);
  }
}
