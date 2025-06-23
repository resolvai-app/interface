"use client";

/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import AudioPulse from "@/components/audio-pulse/AudioPulse";
import SettingsDialog from "@/components/settings-dialog/SettingsDialog";
import { useLiveAPIContext } from "@/contexts/LiveAPIContext";
import { AudioRecorder } from "@/lib/audio-recorder";
import cn from "classnames";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaPhone, FaPhoneSlash, FaTimes } from "react-icons/fa";
import { audioContext } from "@/lib/utils";

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff00";
      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.shadowColor = "#00ff00";
        ctx.shadowBlur = 5;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        ctx.shadowBlur = 0;

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full opacity-60 pointer-events-none z-0"
      style={{ position: "absolute" }}
    />
  );
};

export const CallModal = ({
  isActive,
  onEndCall,
  chatId,
}: {
  chatId: string;
  isActive: boolean;
  onEndCall: () => void;
}) => {
  const [inVolume, setInVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRecorder = useRef<AudioRecorder | null>(null);
  const { client, connected, connect, disconnect, volume } = useLiveAPIContext();
  const controls = useAnimation();

  // Animate the pulse only when there is sound, with smooth/slow linear transition
  useEffect(() => {
    if (connected && inVolume > 0.01) {
      controls.start({
        scale: 1 + Math.min(inVolume, 1) * 0.8,
        boxShadow: [
          "0 0 0px 0px #22d3ee44",
          `0 0 ${32 + inVolume * 48}px ${8 + inVolume * 32}px #22d3ee${Math.floor(100 + inVolume * 100).toString(16)}`,
          "0 0 0px 0px #22d3ee44",
        ],
        transition: {
          duration: 0.3,
          ease: "linear",
        },
      });
    } else {
      controls.start({
        scale: 1,
        boxShadow: "0 0 0px 0px #22d3ee44",
        transition: { duration: 0.5, ease: "linear" },
      });
    }
  }, [inVolume, connected, controls]);

  // Recorder init
  useEffect(() => {
    audioRecorder.current = new AudioRecorder();
    return () => {
      audioRecorder.current?.stop();
    };
  }, []);

  // Data send + volume
  useEffect(() => {
    const recorder = audioRecorder.current;
    const onData = (data: { mimeType: string; payload: string }) => {
      client.sendRealtimeInput([data]);
    };
    client.on("close", (e) => {
      setError(e.reason);
    });
    if (isActive && connected && recorder) {
      recorder
        .on("data", onData)
        .on("volume", setInVolume)
        .start()
        .catch((e) => {
          setError(e.message);
        });
    } else {
      recorder?.stop();
    }
    return () => {
      recorder?.off("data", onData).off("volume", setInVolume);
    };
  }, [connected, client, isActive]);

  // 新增：包装 connect 事件
  const handleConnect = async () => {
    try {
      const ctx = await audioContext();
      if (ctx.state === "suspended") {
        await ctx.resume();
        console.log("[audio-context] resumed by user gesture");
      }
    } catch (e) {
      console.log("[audio-context] resume error:", e);
    }
    connect(chatId);
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center min-h-screen z-50">
      <MatrixRain />
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90 z-10" />

      <SettingsDialog />
      {/* Center lively animated pulse */}
      <div className="flex-1 flex items-center justify-center w-full relative z-20">
        <motion.div
          className="rounded-full border-2 border-cyan-400 flex items-center justify-center relative"
          style={{ width: 220, height: 220 }}
          animate={{
            ...controls,
            rotate: connected ? 360 : 0,
          }}
          transition={{
            rotate: {
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            },
            scale: {
              duration: 0.3,
              ease: "linear",
            },
            boxShadow: {
              duration: 0.3,
              ease: "linear",
            },
          }}
        >
          {/* 外圈装饰 */}
          <div className="absolute inset-0 rounded-full border-4 border-cyan-400/20" />
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-ping" />
          <div
            className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute inset-0 rounded-full border border-cyan-400/10 animate-ping"
            style={{ animationDelay: "1s" }}
          />

          {/* 内部装饰圆环 */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-cyan-400/40"
            animate={{
              rotate: connected ? -360 : 0,
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* 中心内容 */}
          <motion.div
            className="relative z-10"
            animate={{
              rotate: connected ? -360 : 0,
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <AudioPulse volume={volume} active={connected} hover={false} />
          </motion.div>

          {/* 装饰性粒子 */}
          {connected && (
            <>
              <motion.div
                className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                style={{ top: "10%", left: "50%" }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                style={{ bottom: "10%", right: "50%" }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </>
          )}
        </motion.div>
      </div>
      {error && <div className="text-red-500 z-20">{error}</div>}
      {/* Bottom control buttons */}
      <div className="flex justify-between gap-40 mb-24 relative z-20">
        {/* Connect/Disconnect */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition relative",
            connected
              ? "bg-cyan-500 text-white hover:bg-cyan-600"
              : "bg-gray-800 text-cyan-400 hover:bg-gray-700"
          )}
          onClick={connected ? disconnect : handleConnect}
          aria-label={connected ? "Disconnect" : "Connect"}
        >
          <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping" />
          {connected ? <FaPhoneSlash size={24} /> : <FaPhone size={24} />}
        </motion.button>

        {/* Hang up */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-red-500 hover:bg-gray-700 transition relative"
          onClick={onEndCall}
          aria-label="Hang up"
        >
          <div className="absolute inset-0 rounded-full border border-red-500/30 animate-ping" />
          <FaTimes size={24} />
        </motion.button>
      </div>
    </div>
  );
};
