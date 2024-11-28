import io from "socket.io-client";
import { v4 as uuidV4 } from "uuid";
import { SourceType } from "@/types";
import { hidePluginWindow } from "../utils";

const socket = io(import.meta.env.VITE_SOCKET_URL as string);

let videoTransferFileName: string | undefined;

let mediaRecorder: MediaRecorder;

let userid: string;

export const startRecording = (source: SourceType) => {
  hidePluginWindow(true);

  videoTransferFileName = `${uuidV4()}-${source.id.slice(0, 8)}.webm`;

  mediaRecorder.start(1000);
};

export const stopRecording = () => {
  mediaRecorder.stop();
};

export const onDataAvailable = (e: BlobEvent) => {
  alert("Running");

  socket.emit("video-chunks", {
    chunks: e.data,
    fileName: videoTransferFileName,
  });
};

export const onStopRecording = () => {
  hidePluginWindow(false);

  socket.emit("process-video", {
    fileName: videoTransferFileName,
    userid,
  });
};

export const selectSources = async (
  source: SourceType,.
  videoElement: React.RefObject<HTMLVideoElement>
) => {
  if (!source || !source.id || !source.audio || !source.screen) {
    return;
  }

  const constraints = {
    audio: false,
    video: {
      chromeMediaSource: "desktop",
      chromeMediaSourceId: source.screen,
      width: { ideal: source.preset === "HD" ? 1920 : 1280 },
      height: { ideal: source.preset === "HD" ? 1080 : 720 },
      frameRate: { ideal: 30 },
    },
  };

  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  const audioStream = await navigator.mediaDevices.getUserMedia({
    video: false,
    audio: source.audio
      ? {
          deviceId: { exact: source.audio },
        }
      : false,
  });

  userid = source.id;

  if (videoElement && videoElement.current) {
    videoElement.current.srcObject = stream;

    await videoElement.current.play();
  }

  const combinedStream = new MediaStream([
    ...stream.getTracks(),
    ...audioStream.getTracks(),
  ]);

  mediaRecorder = new MediaRecorder(combinedStream, {
    mimeType: "video/webm; codecs=vp9",
  });

  mediaRecorder.ondataavailable = onDataAvailable;

  mediaRecorder.onstop = onStopRecording;
};
