import { EventEmitter } from "eventemitter3";
import { LiveClientOptions, StreamingLog } from "../types";
import { base64ToArrayBuffer } from "./utils";

/**
 * Event types that can be emitted by the MultimodalLiveClient.
 * Each event corresponds to a specific message from GenAI or client state change.
 */
export interface LiveClientEventTypes {
  // Emitted when audio data is received
  audio: (data: ArrayBuffer) => void;
  // Emitted when the connection closes
  close: (event: CloseEvent) => void;
  // Emitted when content is received from the server
  content: (data: any) => void;
  // Emitted when an error occurs
  error: (error: Event) => void;
  // Emitted when the server interrupts the current generation
  interrupted: () => void;
  // Emitted for logging events
  log: (log: StreamingLog) => void;
  // Emitted when the connection opens
  open: () => void;
  // Emitted when the initial setup is complete
  setupcomplete: () => void;
  // Emitted when the current turn is complete
  turncomplete: () => void;
}

/**
 * A event-emitting class that manages the connection to the websocket and emits
 * events to the rest of the application.
 * If you dont want to use react you can still use this.
 */
export class WssLiveClient extends EventEmitter<LiveClientEventTypes> {
  private ws: WebSocket | null = null;
  private _status: "connected" | "disconnected" | "connecting" = "disconnected";
  private _streamId: string | null = null;
  public get status() {
    return this._status;
  }

  protected config: LiveClientOptions | null = null;

  public getConfig() {
    return { ...this.config };
  }

  constructor(options: LiveClientOptions) {
    super();
    this.send = this.send.bind(this);
    this.onopen = this.onopen.bind(this);
    this.onerror = this.onerror.bind(this);
    this.onclose = this.onclose.bind(this);
    this.onmessage = this.onmessage.bind(this);
    this.config = options;
  }

  protected log(type: string, message: StreamingLog["message"]) {
    const log: StreamingLog = {
      date: new Date(),
      type,
      message,
    };
    this.emit("log", log);
  }

  async connect(chatId: string): Promise<boolean> {
    this._streamId = chatId;
    if (this._status === "connected" || this._status === "connecting") {
      return false;
    }

    this._status = "connecting";
    try {
      // 假设 WebSocket 地址由 config 提供
      const wsUrl = this.config?.url ?? "ws://localhost:3000";
      this.ws = new WebSocket(`${wsUrl}/user`);
      this.ws.onopen = this.onopen;
      this.ws.onmessage = (event) => this.onmessage(event);
      this.ws.onerror = this.onerror;
      this.ws.onclose = this.onclose;
    } catch (e) {
      console.error("Error connecting to WebSocket:", e);
      this._status = "disconnected";
      return false;
    }

    this._status = "connected";
    return true;
  }

  public disconnect() {
    if (!this.ws) {
      return false;
    }
    this.ws.close();
    this.ws = null;
    this._status = "disconnected";

    this.log("client.close", `Disconnected`);
    return true;
  }

  protected onopen() {
    this.log("client.open", "Connected");
    this.emit("open");
  }

  protected onerror(e: Event) {
    this.log("server.error", (e as ErrorEvent).message);
    this.emit("error", e);
  }

  protected onclose(e: CloseEvent) {
    this.log(`server.close`, `disconnected ${e.reason ? `with reason: ${e.reason}` : ``}`);
    this.emit("close", e);
  }

  protected async onmessage(message: MessageEvent) {
    const messageData = JSON.parse(message.data) as {
      event: string;
      media?: {
        mimeType: string;
        payload: string;
      };
      content?: string;
    };
    if (messageData.media) {
      this.emit("audio", base64ToArrayBuffer(messageData.media.payload));
    }
    if (messageData.content) {
      this.emit("content", messageData.content);
    }
    switch (messageData.event) {
      case "turn_complete":
        this.emit("turncomplete");
        break;
      case "setup_complete":
        this.emit("setupcomplete");
        break;
      case "interrupted":
        this.emit("interrupted");
        break;
      default:
        break;
    }

    this.log(`server.content`, message.data);
  }

  /**
   * send realtimeInput, this is base64 chunks of "audio/pcm" and/or "image/jpg"
   */
  sendRealtimeInput(chunks: Array<{ mimeType: string; payload: string }>) {
    if (!this.ws) return;
    let hasAudio = false;
    let hasVideo = false;
    for (const ch of chunks) {
      this.ws.send(JSON.stringify({ media: ch, event: "media", streamSid: this._streamId }));
      if (ch.mimeType.includes("audio")) {
        hasAudio = true;
      }
      if (ch.mimeType.includes("image")) {
        hasVideo = true;
      }
      if (hasAudio && hasVideo) {
        break;
      }
    }
    const message =
      hasAudio && hasVideo ? "audio + video" : hasAudio ? "audio" : hasVideo ? "video" : "unknown";
    this.log(`client.realtimeInput`, message);
  }
  /**
   * send normal content parts such as { text }
   */
  send(parts: any | any[], turnComplete: boolean = true) {
    if (!this.ws) return;
    this.ws.send(JSON.stringify({ turns: parts, turnComplete }));
    this.log(`client.send`, {
      turns: Array.isArray(parts) ? parts : [parts],
      turnComplete,
    });
  }
}
