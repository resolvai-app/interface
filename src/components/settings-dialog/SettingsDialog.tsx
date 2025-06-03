"use client";
import { memo, useState } from "react";
import { FaCog } from "react-icons/fa";

export default memo(function SettingsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        className="fixed top-4 right-4 z-50 p-2 bg-transparent hover:bg-gray-200/30 rounded-full text-gray-400 hover:text-gray-700 transition-all shadow-none"
        style={{ fontSize: 18 }}
        onClick={() => setIsOpen(true)}
        aria-label="Settings"
      >
        <FaCog size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-[calc(100%-2rem)] max-w-md mx-4 p-4 sm:p-8 bg-gray-900 rounded-lg animate-scaleIn">
            <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-semibold text-center text-white">
              设置
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-medium text-white">Coming soon...</h3>
                Coming soon...
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                className="px-6 py-2.5 text-sm font-medium text-gray-200 transition-colors bg-gray-800 rounded-lg hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
