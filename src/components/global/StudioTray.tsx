import { SourceType } from "@/types";
import { Cast, Pause, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn, getVideoRecordingTime } from "@/lib/utils";
import {
  stopRecording,
  startRecording,
  selectSources,
} from "@/lib/actions/recorder";

const StudioTray = () => {
  const initialTime = new Date();

  const [count, setCount] = useState(0);

  const [preview, setPreview] = useState(false);

  const [timer, setTimer] = useState("00:00:00");

  const [recording, setRecording] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [source, setSource] = useState<SourceType | undefined>(undefined);

  window.ipcRenderer.on("profile-recieved", (event, payload) => {
    console.log(event);

    setSource(payload);
  });

  const onRecord = () => {
    if (!source) return;

    setRecording(true);

    startRecording(source);
  };

  const clearTimer = () => {
    setTimer("00:00:00");

    setCount(0);
  };

  useEffect(() => {
    if (!source || !source.screen) return;

    selectSources(source, videoRef);

    return () => {
      selectSources(source, videoRef);
    };
  }, [source]);

  useEffect(() => {
    if (!recording) return;

    const interval = setInterval(() => {
      const time = count + (new Date().getTime() - initialTime.getTime());

      setCount(time);

      const recordingTime = getVideoRecordingTime(time);

      if (source?.plan === "FREE" && recordingTime.minute === "05") {
        setRecording(false);

        clearTimer();

        stopRecording();
      }

      setTimer(recordingTime.length);

      if (time < 0) {
        setTimer("00:00:00");

        clearInterval(interval);
      }
    }, 1);

    () => clearInterval(interval);
  }, [recording]);

  return (
    <>
      {source && (
        <div className="h-screen draggable flex flex-col gap-5">
          {preview && (
            <video
              className="w-full border-2 border-muted-foreground"
              ref={videoRef}
              autoPlay
            />
          )}

          <div className="draggable bg-[#171717] flex items-center justify-around w-full h-20 border-2 border-muted-foreground rounded-full">
            <div
              onClick={onRecord}
              className={cn(
                "non-draggable relative rounded-full cursor-pointer hover:opacity-80",
                recording ? "bg-red-500 w-6 h-6" : "bg-red-400 w-8 h-8"
              )}
            >
              {recording && (
                <span className="absolute top-1/2 -right-16 transform -translate-y-1/2">
                  {timer}
                </span>
              )}
            </div>

            {recording ? (
              <Square
                className="non-draggable cursor-pointer hover:scale-110 transition transform duration-150"
                size={32}
                fill="white"
                stroke="white"
                onClick={() => {
                  setRecording(false);

                  clearTimer();

                  stopRecording();
                }}
              />
            ) : (
              <Pause
                className="non-draggable cursor-pointer opacity-50"
                size={32}
                fill="white"
                stroke="none"
              />
            )}

            <Cast
              className="non-draggable cursor-pointer opacity-60"
              size={32}
              fill="white"
              stroke="white"
              onClick={() => {
                setPreview((prev) => !prev);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default StudioTray;
