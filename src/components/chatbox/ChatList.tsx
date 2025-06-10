"use client";

import { Chat } from "@/types";
import { motion } from "framer-motion";
import { FaTrash, FaInbox, FaPlus, FaEdit } from "react-icons/fa";
import { useState } from "react";

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onChatSelect: (chatId: string | null) => void;
  onChatDelete: (chatId: string) => void;
  onChatUpdate: (chatId: string, updates: Partial<Chat>) => void;
}

export default function ChatList({
  chats,
  selectedChatId,
  onChatSelect,
  onChatDelete,
  onChatUpdate,
}: ChatListProps) {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const handleEditClick = (e: React.MouseEvent, chat: Chat) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
  };

  const handleEditSubmit = (chatId: string, newTitle: string) => {
    if (newTitle.trim() === "") return;
    onChatUpdate(chatId, { title: newTitle });
    setEditingChatId(null);
  };

  const handleBlur = (chatId: string, newTitle: string) => {
    handleEditSubmit(chatId, newTitle);
  };

  return (
    <div className="h-full flex flex-col bg-gray-900/80 backdrop-blur-sm fixed inset-0">
      <div className="p-4 border-b border-gray-800 flex justify-end sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm">
        <button
          onClick={() => onChatSelect(null)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
        >
          <FaPlus className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pt-8 relative">
        {chats.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <FaInbox className="w-12 h-12 mb-4" />
            <p className="text-lg">No chats yet</p>
            <p className="text-sm mt-2">Create a new chat to get started</p>
          </div>
        ) : (
          [...chats]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((chat) => (
              <motion.div
                key={chat.id}
                className={`mb-3 p-3 rounded-lg cursor-pointer transition-colors relative group ${
                  selectedChatId === chat.id
                    ? "bg-blue-500/20 border border-blue-500/50"
                    : "bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/80"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (editingChatId !== chat.id) {
                    onChatSelect(chat.id);
                  }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex space-x-1">
                  <motion.button
                    className="p-1.5 text-gray-400 hover:text-blue-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(e, chat);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaEdit className="w-3.5 h-3.5" />
                  </motion.button>
                  <motion.button
                    className="p-1.5 text-gray-400 hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChatDelete(chat.id);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTrash className="w-3.5 h-3.5" />
                  </motion.button>
                </div>

                {editingChatId === chat.id ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleEditSubmit(chat.id, editingTitle);
                      } else if (e.key === "Escape") {
                        setEditingChatId(null);
                      }
                    }}
                    onBlur={() => handleBlur(chat.id, editingTitle)}
                    className="w-full bg-gray-700 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                ) : (
                  <div className="pr-6">
                    <h3 className="text-white font-medium">{chat.title}</h3>
                  </div>
                )}
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    {new Date(chat.createdAt).toLocaleString()}
                  </div>
                </div>
              </motion.div>
            ))
        )}
      </div>
    </div>
  );
}
