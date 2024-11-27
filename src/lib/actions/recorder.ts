import { v4 as uuidV4 } from "uuid";
import { SourceType } from "@/types";
import { hidePluginWindow } from "../utils";

let videoTransferFileName: string | undefined;

let mediaRecorder: MediaRecorder;

export const startRecording = (source: SourceType) => {
  hidePluginWindow(true);

  videoTransferFileName = `${uuidV4()}-${source.id.slice(0, 8)}.webm`;

  mediaRecorder.start(1000);
};
