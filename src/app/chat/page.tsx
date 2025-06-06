"use client";

import ChatBox from "@/components/chat/ChatBox";
import ChatList from "@/components/chat/ChatList";
import { useChatListStore } from "@/hooks/store/useChatListStore";
import { Chat } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaComments, FaHome } from "react-icons/fa";
import { getApiUrl } from "@/lib/utils";
import NeuralBackground from "@/components/NeuralBackground";

export default function ChatPage() {
  const [isChatListVisible, setIsChatListVisible] = useState(false);
  const { chats, setChats, selectedChatId, setSelectedChatId } = useChatListStore();

  // 检测是否为移动设备
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setIsChatListVisible(!isMobile);
  }, []);

  // 自动选中最新创建的任务
  useEffect(() => {
    if (chats.length > 0 && !selectedChatId) {
      const latestChat = chats.reduce((latest, current) => {
        return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
      });
      setSelectedChatId(latestChat.id);
    }
  }, [chats, selectedChatId, setSelectedChatId]);

  const handleChatSelect = (chatId: string | null) => {
    if (chatId === null) {
      fetch(`${getApiUrl()}/chat`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          title: "New Chat",
          description: "Click to edit chat details",
          state: {
            model: "gemini-2.0-flash-live-001",
            voice: "alloy",
          },
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setChats([...chats, data.result]);
          setSelectedChatId(data.result.id);
        });
    } else {
      setSelectedChatId(chatId);
    }
  };

  const handleChatDelete = (chatId: string) => {
    fetch(`${getApiUrl()}/chat/${chatId}`, {
      method: "DELETE",
    }).then(() => {
      const updatedChats = chats.filter((chat) => chat.id !== chatId);
      setChats(updatedChats);
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
      }
    });
  };

  const handleChatUpdate = (chatId: string, updates: Partial<Chat>) => {
    fetch(`${getApiUrl()}/chat`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ id: chatId, ...updates }),
    }).then(() => {
      const updatedChats = chats.map((chat) =>
        chat.id === chatId ? { ...chat, ...updates } : chat
      );
      setChats(updatedChats);
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <NeuralBackground />
      <div className="fixed top-0 left-0 right-0 h-16 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-40">
        <div className="h-full flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <FaComments className="w-6 h-6" />
            <h1 className="text-xl font-semibold">Chat Manager</h1>
          </div>
          <Link href="/" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <FaHome className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="relative pt-16">
        <AnimatePresence>
          {isChatListVisible && (
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed top-16 left-0 w-80 h-[calc(100vh-4rem)] bg-gray-900/80 backdrop-blur-md border-r border-gray-800 z-50"
            >
              <ChatList
                chats={chats}
                selectedChatId={selectedChatId}
                onChatSelect={handleChatSelect}
                onChatDelete={handleChatDelete}
                onChatUpdate={handleChatUpdate}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 收缩按钮 */}
        <button
          onClick={() => setIsChatListVisible(!isChatListVisible)}
          className="fixed left-4 top-20 z-50 p-2 bg-gray-800 rounded-full text-gray-300 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isChatListVisible ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
            />
          </svg>
        </button>

        <motion.div
          className={`h-[calc(100vh-4rem)] transition-all duration-300 ${
            isChatListVisible ? "md:ml-80" : ""
          }`}
        >
          <ChatBox />
        </motion.div>
      </div>
    </div>
  );
}
