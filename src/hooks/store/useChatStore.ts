"use client";
import { getApiUrl } from "@/lib/utils";
import { Chat } from "@/types";
import { Message } from "@ai-sdk/react";
import { create } from "zustand";

interface ChatStore {
  userId: string;
  getUserId: () => string;
  // 聊天消息相关
  syncMessages: (chatId: string, setMessages: (messages: Message[]) => void) => void;
  saveMessages: (chatId: string, messages: Message[]) => void;

  // 聊天列表相关`
  chats: Chat[];
  fetchChats: () => Promise<Chat[] | undefined>;
  upsertChat: (chat: Partial<Chat>) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;

  // 选择当前聊天
  selectedChatId: string | null;
  setSelectedChatId: (chatId: string | null) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  userId: "",
  getUserId: () => {
    if (typeof window === "undefined") return "";
    const userId = localStorage.getItem("v2-userId");
    if (userId) {
      return userId;
    }
    const newUserId = crypto.randomUUID();
    localStorage.setItem("v2-userId", newUserId);
    return newUserId;
  },
  // 聊天消息相关
  syncMessages: (chatId, setMessages) => {
    if (typeof window === "undefined") return;
    const savedMessages = localStorage.getItem(`chat-${chatId}`);

    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);

        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          console.log("loadMessages", chatId, parsedMessages);
          setMessages(parsedMessages);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Error parsing saved messages:", error);
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
  },
  saveMessages: (chatId, messages) => {
    console.log("saveMessages", chatId, messages);
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(`chat-${chatId}`, JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving messages:", error);
    }
  },
  // 选择当前聊天
  selectedChatId: null,
  setSelectedChatId: (chatId) => {
    set({ selectedChatId: chatId });
  },
  // 聊天列表相关
  chats: [],
  fetchChats: async () => {
    try {
      const userId = get().getUserId();
      console.log("fetchChats", userId);
      const response = await fetch(`${getApiUrl()}/chat-manager/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        console.error("Failed to fetch chats");
        return;
      }
      const data = await response.json();
      if (data.total > 0) {
        set({ chats: data.result });
      } else {
        set({ chats: [] });
        localStorage.clear();
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
    return get().chats;
  },

  // 创建聊天
  upsertChat: async (chat) => {
    try {
      const response = await fetch(`${getApiUrl()}/chat-manager/upsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...chat, userId: get().getUserId() }),
      });
      if (!response.ok) {
        console.error("Failed to create chat");
        return;
      }
      const data = await response.json();
      if (chat.id) {
        set({
          selectedChatId: chat.id,
          chats: get().chats.map((c) => (c.id === chat.id ? { ...chat, ...data.result } : c)),
        });
      } else {
        set({ selectedChatId: data.result.id, chats: [...get().chats, data.result] });
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  },

  // 删除聊天
  deleteChat: async (chatId) => {
    try {
      const response = await fetch(`${getApiUrl()}/chat-manager/delete/${chatId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        console.error("Failed to delete chat");
        return;
      }
      set({ chats: get().chats.filter((c) => c.id !== chatId) });
      set({ selectedChatId: null });
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  },
}));
