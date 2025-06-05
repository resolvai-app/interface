"use client";
import { useChatListStore } from "@/hooks/store/useChatListStore";
import { useChat, Message } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { CallModal } from "./CallModal";
import { ChatInput } from "./ChatInput";
import { ChatSelection } from "./ChatSelection";
import { MessageList } from "./MessageList";
import { getApiUrl } from "@/lib/utils";
import { useChatStore } from "@/hooks/store/useChatStore";

// 主组件
export default function ChatBox() {
  const { selectedChatId, chats, setChats, setSelectedChatId } = useChatListStore();
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    maxSteps: 5,
    id: selectedChatId || "default",
    initialMessages: [],
  });
  const [isCallActive, setIsCallActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { loadMessages, saveMessages } = useChatStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startCall = async () => {
    setIsCallActive(true);
  };

  const endCall = () => {
    setIsCallActive(false);
  };

  useEffect(() => {
    if (selectedChatId) {
      loadMessages(selectedChatId, setMessages);
    } else {
      setMessages([]);
    }
  }, [selectedChatId, loadMessages, setMessages]);

  useEffect(() => {
    if (selectedChatId && messages.length > 0) {
      saveMessages(selectedChatId, messages as Message[]);
    }
  }, [messages, selectedChatId, saveMessages]);

  const handleCreateChat = (type: "food" | "hospital") => {
    fetch(`${getApiUrl()}/chat`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        title: type === "food" ? "Food Delivery Chat" : "Hospital Registration Chat",
        description: type === "food" ? "Order food delivery service" : "Book hospital appointment",
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
  };

  if (!selectedChatId) {
    return <ChatSelection onCreateChat={handleCreateChat} />;
  }

  return (
    <div className="h-full flex flex-col relative">
      <CallModal isActive={isCallActive} onEndCall={endCall} chatId={selectedChatId} />

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <MessageList messages={messages} messagesEndRef={messagesEndRef} />
        </div>
      </div>

      <ChatInput
        input={input}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        isCallActive={isCallActive}
        onCallToggle={isCallActive ? endCall : startCall}
      />

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-ripple {
          animation: ripple 1s ease-out infinite;
        }
      `}</style>
    </div>
  );
}
