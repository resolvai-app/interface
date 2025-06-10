"use client";
import { FaPhone, FaPhoneSlash } from "react-icons/fa";

interface ChatInputProps {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isCallActive: boolean;
  onCallToggle: () => void;
}

export const ChatInput = ({
  input,
  onInputChange,
  onSubmit,
  isCallActive,
  onCallToggle,
}: ChatInputProps) => (
  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-md border-t border-gray-800">
    <div className="max-w-4xl mx-auto">
      <form onSubmit={onSubmit} className="flex space-x-4">
        <input
          value={input}
          onChange={onInputChange}
          placeholder="Type your message..."
          className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={onCallToggle}
          className={`px-4 py-2 rounded-lg transition-colors ${
            isCallActive ? "bg-red-500 hover:bg-red-600" : "bg-gray-700 hover:bg-gray-600"
          } text-white`}
        >
          {isCallActive ? <FaPhoneSlash className="w-5 h-5" /> : <FaPhone className="w-5 h-5" />}
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  </div>
);
