"use client";

import ChatBox from "@/components/chatbox/ChatBox";
import ChatList from "@/components/chatbox/ChatList";
import NeuralBackground from "@/components/NeuralBackground";
import { useChatStateContext } from "@/contexts/ChatStateContext";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaComments, FaHome } from "react-icons/fa";

export default function ChatPage() {
  const [isChatListVisible, setIsChatListVisible] = useState(false);
  const { fetchChats } = useChatStateContext();

  useQuery({
    queryKey: ["chats"],
    queryFn: () => fetchChats(),
  });

  // 检测是否为移动设备
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setIsChatListVisible(!isMobile);
  }, []);

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
              <ChatList />
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
