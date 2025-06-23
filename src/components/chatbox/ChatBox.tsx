"use client";
import { useChatStateContext } from "@/contexts/ChatStateContext";
import { useLiveAPIContext } from "@/contexts/LiveAPIContext";
import { Message } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { CallModal } from "./CallModal";
import { ChatInput } from "./ChatInput";
import { ChatSelection } from "./ChatSelection";
import { MessageList } from "./MessageList";

// 主组件
export default function ChatBox() {
  const { client, connected, connect, disconnect } = useLiveAPIContext();
  const { selectedChatId, upsertChat, saveMessages, syncMessages } = useChatStateContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [lastMessageId, setLastMessageId] = useState<string>(crypto.randomUUID());
  const lastMessageIdRef = useRef(lastMessageId);

  useEffect(() => {
    lastMessageIdRef.current = lastMessageId;
  }, [lastMessageId]);

  const appendClientMessage = useCallback((message: Message) => {
    setMessages((prevMessages) => {
      const id = lastMessageIdRef.current;
      const index = prevMessages.findIndex((m) => m.id === id);
      if (index !== -1) {
        // 合并 parts，type = 'text' 的合并为一个 part
        const oldParts = prevMessages[index].parts;
        const newParts = message.parts;
        const allParts = [...oldParts, ...newParts];
        const mergedParts: typeof allParts = [];
        let textBuffer = "";
        for (const part of allParts) {
          if (part.type === "text") {
            textBuffer += part.text;
          } else {
            if (textBuffer) {
              mergedParts.push({ type: "text", text: textBuffer });
              textBuffer = "";
            }
            mergedParts.push(part);
          }
        }
        if (textBuffer) {
          mergedParts.push({ type: "text", text: textBuffer });
        }
        return [
          ...prevMessages.slice(0, index),
          {
            ...prevMessages[index],
            parts: mergedParts,
            content: mergedParts
              .filter((p) => p.type === "text")
              .map((p) => p.text)
              .join(""),
          },
          ...prevMessages.slice(index + 1),
        ];
      } else {
        message.id = id;
        return [...prevMessages, message];
      }
    });
  }, []);

  useEffect(() => {
    if (client) {
      client.off("content").off("turncomplete");
      client
        .on("content", (data) => {
          console.log("content", data);
          const id = lastMessageIdRef.current;
          const newMessage = {
            role: "assistant",
            content: data.modelTurn.parts[0].text,
            id,
            parts: data.modelTurn.parts.map((part: Record<string, unknown>) => ({
              type: part.text ? "text" : "toolInvocation",
              text: part.text,
            })),
          } as Message;
          appendClientMessage(newMessage);
        })
        .on("turncomplete", () => {
          setLastMessageId(crypto.randomUUID());
        });
    }
    if (selectedChatId) {
      disconnect();
      connect(selectedChatId, isCallActive ? "audio" : "text");
    }
  }, [selectedChatId, isCallActive, client, disconnect, connect, appendClientMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && selectedChatId) {
      setMessages([
        ...messages,
        {
          role: "user",
          content: input,
          id: crypto.randomUUID(),
          parts: [{ type: "text", text: input }],
        },
      ]);
      setInput("");
      if (!connected) {
        connect(selectedChatId, isCallActive ? "audio" : "text");
      }
      client.send({
        event: "content",
        streamSid: selectedChatId,
        content: {
          text: input,
        },
      });
    }
  };

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
        type: type === "food" ? "book_restaurant" : "unsubscribe_netflix",
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
        onInputChange={(e) => setInput(e.target.value)}
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
