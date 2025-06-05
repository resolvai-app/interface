"use client";
import { Message } from "@ai-sdk/react";
import { create } from "zustand";

interface ChatStore {
  loadMessages: (chatId: string, setMessages: (messages: Message[]) => void) => void;
  saveMessages: (chatId: string, messages: Message[]) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  loadMessages: (chatId, setMessages) => {
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
}));
