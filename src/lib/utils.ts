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

export type GetAudioContextOptions = AudioContextOptions & {
  id?: string;
};

const map: Map<string, AudioContext> = new Map();

function getAudioContextCtor() {
  if (typeof window === "undefined") return AudioContext;
  return window.AudioContext || (window as any).webkitAudioContext;
}

async function createContext(options?: GetAudioContextOptions) {
  const Ctx = getAudioContextCtor();
  const ctx = new Ctx(options);
  if (options?.id) {
    map.set(options.id, ctx);
  }
  return ctx;
}

export const audioContext: (options?: GetAudioContextOptions) => Promise<AudioContext> = async (
  options
) => {
  try {
    // 触发用户交互，兼容移动端
    console.log("[audio-context] Audio play start");
    const a = new Audio();
    a.src =
      "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
    await Promise.race([
      a.play(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Audio play timeout")), 1000)),
    ]);
    console.log("[audio-context] Audio play end");
    if (options?.id && map.has(options.id)) {
      return map.get(options.id)!;
    }
    return await createContext(options);
  } catch (e) {
    console.log("[audio-context] Audio play error:", e);
    // 失败时等待一次用户交互
    await new Promise((res) => {
      if (typeof window === "undefined") return;
      window.addEventListener("pointerdown", res, { once: true });
      window.addEventListener("keydown", res, { once: true });
    });
    if (options?.id && map.has(options.id)) {
      return map.get(options.id)!;
    }
    return await createContext(options);
  }
};

export function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
