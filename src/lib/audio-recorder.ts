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

import { audioContext } from "./utils";
import AudioRecordingWorklet from "./worklets/audio-processing";
import VolMeterWorket from "./worklets/vol-meter";

import EventEmitter from "eventemitter3";
import { createWorketFromSrc } from "./audioworklet-registry";

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export class AudioRecorder extends EventEmitter {
  stream: MediaStream | undefined;
  audioContext: AudioContext | undefined;
  source: MediaStreamAudioSourceNode | undefined;
  recording: boolean = false;
  recordingWorklet: AudioWorkletNode | undefined;
  vuWorklet: AudioWorkletNode | undefined;

  private starting: Promise<void> | null = null;

  constructor(public sampleRate = 16000) {
    super();
  }

  async start() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Could not request user media");
    }

    this.starting = new Promise(async (resolve, reject) => {
      try {
        console.log("[audio-recorder] starting");
        // 获取麦克风权限
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // 创建音频上下文
        this.audioContext = await audioContext({ sampleRate: this.sampleRate });
        // 创建音频源
        this.source = this.audioContext.createMediaStreamSource(this.stream);
        // 录音工作线程
        const workletName = "audio-recorder-worklet";
        // 添加录音工作线程
        await this.audioContext.audioWorklet.addModule(
          createWorketFromSrc(workletName, AudioRecordingWorklet)
        );
        console.log("[audio-recorder] addModule", this.audioContext.audioWorklet);
        this.recordingWorklet = new AudioWorkletNode(this.audioContext, workletName);
        // 录音工作线程消息处理
        this.recordingWorklet.port.onmessage = async (ev: MessageEvent) => {
          // worklet processes recording floats and messages converted buffer
          const arrayBuffer = ev.data.data.int16arrayBuffer;
          if (arrayBuffer) {
            const arrayBufferString = arrayBufferToBase64(arrayBuffer);
            this.emit("data", {
              mimeType: `audio/pcm;rate=${this.sampleRate}`,
              payload: arrayBufferString,
            });
          }
        };
        // 连接音频源到录音工作线程
        this.source.connect(this.recordingWorklet);
        // vu meter worklet 音量检测
        const vuWorkletName = "vu-meter";
        await this.audioContext.audioWorklet.addModule(
          createWorketFromSrc(vuWorkletName, VolMeterWorket)
        );
        this.vuWorklet = new AudioWorkletNode(this.audioContext, vuWorkletName);
        // 音量检测工作线程消息处理
        this.vuWorklet.port.onmessage = (ev: MessageEvent) => {
          this.emit("volume", ev.data.volume);
        };
        // 连接音频源到音量检测工作线程
        this.source.connect(this.vuWorklet);
        // 连接音频源到录音工作线程
        this.recording = true;
        resolve();
        this.starting = null;
      } catch (error) {
        reject(error);
      }
    });
  }

  stop() {
    // its plausible that stop would be called before start completes
    // such as if the websocket immediately hangs up
    const handleStop = () => {
      this.source?.disconnect();
      this.stream?.getTracks().forEach((track) => track.stop());
      this.stream = undefined;
      this.recordingWorklet = undefined;
      this.vuWorklet = undefined;
    };
    if (this.starting) {
      this.starting.then(handleStop);
      return;
    }
    handleStop();
  }
}
