"use client";
import { create } from "zustand";
import { Message } from "@ai-sdk/react";

interface ChatStore {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  loadMessages: (chatId: string) => void;
  saveMessages: (chatId: string, messages: Message[]) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  loadMessages: (chatId) => {
    if (typeof window === "undefined") return;
    const savedMessages = localStorage.getItem(`chat-${chatId}`);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          set({ messages: parsedMessages });
        } else {
          set({ messages: [] });
        }
      } catch (error) {
        console.error("Error parsing saved messages:", error);
        set({ messages: [] });
      }
    } else {
      set({ messages: [] });
    }
  },
  saveMessages: (chatId, messages) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(`chat-${chatId}`, JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving messages:", error);
    }
  },
}));
