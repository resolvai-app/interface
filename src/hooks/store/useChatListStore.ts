"use client";
import { Chat } from "@/types";
import { create } from "zustand";
import { getApiUrl } from "@/lib/utils";

interface ChatState {
  chats: Chat[];
  selectedChatId: string | null;
  setChats: (chats: Chat[]) => void;
  setSelectedChatId: (chatId: string | null) => void;
  fetchChats: () => Promise<void>;
}

export const useChatListStore = create<ChatState>((set) => ({
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
  fetchChats: async () => {
    try {
      const response = await fetch(`${getApiUrl()}/chat-list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch chats");
      }
      const data = await response.json();
      const dbChats: Chat[] = data.result;

      // 获取本地存储的聊天列表
      const savedChats = localStorage.getItem("chats");
      let localChats: Chat[] = [];
      if (savedChats) {
        try {
          localChats = JSON.parse(savedChats);
        } catch (error) {
          console.error("Error parsing saved chats:", error);
        }
      }

      // 过滤掉不在数据库中的聊天
      const validChats = localChats.filter((localChat) =>
        dbChats.some((dbChat: Chat) => dbChat.id === localChat.id)
      );

      // 更新状态和本地存储
      set({ chats: validChats });
      localStorage.setItem("chats", JSON.stringify(validChats));
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  },
}));

// 在客户端初始化时加载数据
if (typeof window !== "undefined") {
  // 只加载选中的聊天ID
  const savedSelectedChatId = localStorage.getItem("selectedChatId");
  if (savedSelectedChatId) {
    useChatListStore.getState().setSelectedChatId(savedSelectedChatId);
  }

  // 获取数据库中的聊天列表并过滤
  useChatListStore.getState().fetchChats();
}
