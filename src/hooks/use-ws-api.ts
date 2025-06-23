import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AudioStreamer } from "../lib/audio-streamer";
import { audioContext } from "../lib/utils";
import VolMeterWorket from "../lib/worklets/vol-meter";
import { WssLiveClient } from "../lib/ws-live-client";
import { LiveClientOptions } from "../types";

export type UseLiveAPIResults = {
  client: WssLiveClient;
  connected: boolean;
  connect: (chatId: string, modality: "audio" | "text") => Promise<void>;
  disconnect: () => Promise<void>;
  volume: number;
};

export function useWssAPI(options: LiveClientOptions): UseLiveAPIResults {
  const liveClient = useMemo(() => new WssLiveClient(options), [options]);
  //receive audio from server and play it
  const audioStreamerRef = useRef<AudioStreamer | null>(null);

  const [connected, setConnected] = useState(false);
  const [volume, setVolume] = useState(0);

  // register audio for streaming server -> speakers
  useEffect(() => {
    if (!audioStreamerRef.current) {
      audioContext({ id: "audio-out" }).then((audioCtx: AudioContext) => {
        audioStreamerRef.current = new AudioStreamer(audioCtx);
        audioStreamerRef.current
          .addWorklet<any>("vumeter-out", VolMeterWorket, (ev: any) => {
            setVolume(ev.data.volume);
          })
          .then(() => {
            console.log("Successfully added worklet");
          });
      });
    }
  }, [audioStreamerRef]);

  useEffect(() => {
    const onOpen = () => {
      setConnected(true);
    };

    const onClose = () => {
      setConnected(false);
    };

    const onError = (error: Event) => {
      console.error("error", error);
    };

    const stopAudioStreamer = () => audioStreamerRef.current?.stop();

    const onAudio = (data: ArrayBuffer) => audioStreamerRef.current?.addPCM16(new Uint8Array(data));

    liveClient
      .on("error", onError)
      .on("open", onOpen)
      .on("close", onClose)
      .on("interrupted", stopAudioStreamer)
      .on("audio", onAudio);

    return () => {
      liveClient
        .off("error", onError)
        .off("open", onOpen)
        .off("close", onClose)
        .off("interrupted", stopAudioStreamer)
        .off("audio", onAudio)
        .disconnect();
    };
  }, [liveClient]);

  const connect = useCallback(
    async (chatId: string, modality: "audio" | "text" = "audio") => {
      liveClient.disconnect();
      await liveClient.connect(chatId, modality);
    },
    [liveClient]
  );

  const disconnect = useCallback(async () => {
    audioStreamerRef.current?.stop();
    liveClient.disconnect();
    setConnected(false);
  }, [setConnected, liveClient]);

  return {
    client: liveClient,
    connected,
    connect,
    disconnect,
    volume,
  };
}
