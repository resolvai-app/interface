"use client";
import { FaHospital, FaUtensils } from "react-icons/fa";

interface ChatSelectionProps {
  onCreateChat: (type: "food" | "hospital") => void;
}

export const ChatSelection = ({ onCreateChat }: ChatSelectionProps) => (
  <div className="h-full flex items-center justify-center p-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
      <button
        className="flex flex-col items-center p-8 bg-gray-800/50 rounded-xl hover:bg-gray-800/80 transition-colors group"
        onClick={() => onCreateChat("food")}
      >
        <FaUtensils className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
        <h3 className="text-xl font-semibold text-white mb-2">Food Chat</h3>
        <p className="text-gray-400 text-center">
          Create a chat related to food delivery or restaurant booking
        </p>
      </button>

      <button
        className="flex flex-col items-center p-8 bg-gray-800/50 rounded-xl hover:bg-gray-800/80 transition-colors group"
        onClick={() => onCreateChat("hospital")}
      >
        <FaHospital className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
        <h3 className="text-xl font-semibold text-white mb-2">Hospital Chat</h3>
        <p className="text-gray-400 text-center">
          Create a chat related to hospital appointment or medical consultation
        </p>
      </button>
    </div>
  </div>
);
