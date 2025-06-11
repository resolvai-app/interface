"use client";
import { FiSend, FiMic, FiImage, FiPaperclip, FiCamera } from "react-icons/fi";

interface ChatInputProps {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isCallActive: boolean;
  onCallToggle: () => void;
}

export const ChatInput = ({ input, onInputChange, onSubmit, onCallToggle }: ChatInputProps) => (
  <div className="absolute bottom-0 left-0 right-0 p-6 bg-transparent z-30">
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-gray-700 bg-gray-900/80 backdrop-blur shadow-xl flex flex-col focus-within:ring-2 focus-within:ring-cyan-600 transition-all"
      >
        {/* 输入框部分 */}
        <div className="px-4 pt-4 pb-2">
          <input
            value={input}
            onChange={onInputChange}
            placeholder="输入消息..."
            className="w-full bg-transparent border-none outline-none text-white text-base px-0 py-2 placeholder-gray-400"
            style={{ boxShadow: "none" }}
          />
        </div>
        {/* 按钮区 */}
        <div className="flex items-center gap-1 px-4 pb-3 pt-2">
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-400 hover:text-cyan-400 transition"
            title="上传图片"
          >
            <FiImage className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-400 hover:text-cyan-400 transition"
            title="上传文件"
          >
            <FiPaperclip className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-400 hover:text-cyan-400 transition"
            title="拍照"
          >
            <FiCamera className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onCallToggle}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-400 hover:text-cyan-400 transition ml-auto"
            title="语音输入"
          >
            <FiMic className="w-4 h-4" />
          </button>
          <button
            type="submit"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition shadow-md"
            title="发送"
          >
            <FiSend className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  </div>
);
