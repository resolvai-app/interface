"use client";
import { FaComments, FaRobot, FaUser } from "react-icons/fa";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageListProps {
  messages: any[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const MessageList = ({ messages, messagesEndRef }: MessageListProps) => {
  const markdownComponents: Components = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return (
        <code
          className={`${className} ${!match ? "bg-gray-700 px-1 py-0.5 rounded" : "block p-2 bg-gray-700 rounded-lg my-1"}`}
          {...props}
        >
          {children}
        </code>
      );
    },
    pre({ children, ...props }) {
      return (
        <pre className="bg-gray-700 rounded-lg p-2 my-1 overflow-x-auto" {...props}>
          {children}
        </pre>
      );
    },
    p({ children, ...props }) {
      return (
        <p className="my-1" {...props}>
          {children}
        </p>
      );
    },
    ul({ children, ...props }) {
      return (
        <ul className="list-disc list-inside my-1" {...props}>
          {children}
        </ul>
      );
    },
    ol({ children, ...props }) {
      return (
        <ol className="list-decimal list-inside my-1" {...props}>
          {children}
        </ol>
      );
    },
    li({ children, ...props }) {
      return (
        <li className="my-0.5" {...props}>
          {children}
        </li>
      );
    },
    a({ children, ...props }) {
      return (
        <a
          className="text-blue-400 hover:text-blue-300 underline"
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    },
  };

  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500">
        <FaComments className="w-12 h-12 mb-4" />
        <p className="text-lg">No messages yet</p>
        <p className="text-sm mt-2">Start a conversation with the AI assistant</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
        >
          <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
            {message.role === "user" ? (
              <FaUser className="w-3 h-3 text-gray-400" />
            ) : (
              <FaRobot className="w-3 h-3 text-blue-400" />
            )}
          </div>
          <div
            className={`mx-2 p-2 rounded-lg md:max-w-[80%] text-sm ${
              message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-200"
            }`}
          >
            {message.parts.map((part: any, i: number) => {
              switch (part.type) {
                case "text":
                  return (
                    <div
                      key={`${message.id}-${i}`}
                      className="prose prose-invert max-w-none text-sm"
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {part.text}
                      </ReactMarkdown>
                    </div>
                  );
                case "tool-invocation":
                  return (
                    <pre
                      key={`${message.id}-${i}`}
                      className="text-xs mt-1 bg-gray-700 p-2 rounded-lg overflow-x-auto"
                    >
                      {JSON.stringify(part.toolInvocation, null, 2)}
                    </pre>
                  );
              }
            })}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
