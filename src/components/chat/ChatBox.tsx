"use client";

import { useChatStore } from "@/hooks/store/useTaskStore";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { CallModal } from "./CallModal";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";
import { ChatSelection } from "./ChatSelection";

// 主组件
export default function ChatBox() {
  const { selectedChatId, chats, setChats, setSelectedChatId } = useChatStore();
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    maxSteps: 5,
    id: selectedChatId || "default",
    initialMessages: [],
  });
  const [isCallActive, setIsCallActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
      const savedMessages = localStorage.getItem(`chat-${selectedChatId}`);
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
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
    } else {
      setMessages([]);
    }
  }, [selectedChatId, setMessages]);

  useEffect(() => {
    if (selectedChatId && messages.length > 0) {
      try {
        localStorage.setItem(`chat-${selectedChatId}`, JSON.stringify(messages));
      } catch (error) {
        console.error("Error saving messages:", error);
      }
    }
  }, [messages, selectedChatId]);

  const handleCreateChat = (type: "food" | "hospital") => {
    const newChat = {
      id: Date.now().toString(),
      title: type === "food" ? "Food Delivery Chat" : "Hospital Registration Chat",
      description: type === "food" ? "Order food delivery service" : "Book hospital appointment",
      createdAt: new Date().toISOString(),
    };

    setChats([...chats, newChat]);
    setSelectedChatId(newChat.id);
  };

  if (!selectedChatId) {
    return <ChatSelection onCreateChat={handleCreateChat} />;
  }

  return (
    <div className="h-full flex flex-col relative">
      <CallModal isActive={isCallActive} onEndCall={endCall} />

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
