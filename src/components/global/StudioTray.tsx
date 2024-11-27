import { cn } from "@/lib/utils";
import { SourceType } from "@/types";
import { useRef, useState } from "react";
import { startRecording } from "@/lib/api/mutations";

const StudioTray = () => {
  const [preview, setPreview] = useState(false);

  const [recording, setRecording] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [source, setSource] = useState<SourceType | undefined>(undefined);

  const onRecord = () => {
    if (!source) return;

    setRecording(true);

    startRecording(source);
  };

  return (
    <div className="h-screen draggable flex flex-col gap-5">
      <video
        className={cn(
          "w-6/12 border-2 border-muted-foreground self-end",
          preview ? "hidden" : "block"
        )}
        ref={videoRef}
        autoPlay
      />

      <div className="draggable bg-[#171717] flex items-center justify-around w-full h-20 border-2 border-muted-foreground rounded-full">
        <div onClick={onRecord}>Hello</div>
      </div>
    </div>
  );
};

export default StudioTray;
