import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const onCloseApp = () => window.ipcRenderer.send("closeApp");

export const hidePluginWindow = (state: boolean) => {
  window.ipcRenderer.send("hide-plugin", { state });
};

export const getVideoRecordingTime = (ms: number) => {
  const second = Math.floor((ms / 1000) % 60)
    .toString()
    .padStart(2, "0");

  const minute = Math.floor((ms / 1000 / 60) % 60)
    .toString()
    .padStart(2, "0");

  const hour = Math.floor(ms / 1000 / 60 / 60)
    .toString()
    .padStart(2, "0");

  return { length: `${hour}:${minute}:${second}`, minute };
};

export const resizeWindow = (shrink: boolean) => {
  window.ipcRenderer.send("resize-studio", { shrink });
};
