"use client";
import { useChatStateContext } from "@/contexts/ChatStateContext";
import { getApiUrl } from "@/lib/utils";
import { Message, useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { CallModal } from "./CallModal";
import { ChatInput } from "./ChatInput";
import { ChatSelection } from "./ChatSelection";
import { MessageList } from "./MessageList";

// 主组件
export default function ChatBox() {
  const { selectedChatId, upsertChat, saveMessages, syncMessages } = useChatStateContext();
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: `${getApiUrl()}/chat`,
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
      syncMessages(selectedChatId, setMessages);
    } else {
      setMessages([]);
    }
  }, [selectedChatId, syncMessages, setMessages]);

  useEffect(() => {
    if (selectedChatId && messages.length > 0) {
      saveMessages(selectedChatId, messages as Message[]);
    }
  }, [messages, selectedChatId, saveMessages]);

  const handleCreateChat = (type: "food" | "netflix") => {
    upsertChat({
      title: type === "food" ? "Food Delivery Chat" : "Unsubscribe Netflix",
      describe:
        type === "food" ? "Order food delivery service" : "Cancel your Netflix subscription easily",
      state: {
        model: "gemini-2.0-flash-live-001",
        voice: "alloy",
        type: type === "food" ? "food" : "netflix",
      },
    });
  };

  if (!selectedChatId) {
    return <ChatSelection onCreateChat={handleCreateChat} />;
  }

  return (
    <div className="h-full flex flex-col relative">
      <CallModal isActive={isCallActive} onEndCall={endCall} chatId={selectedChatId} />

      <div className="flex-1 overflow-y-auto p-4 pb-[160px]">
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
