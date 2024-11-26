import { AxiosError } from "axios";
import { httpClient } from "../axios";

export const fetchCurrentUser = async (clerkId: string) => {
  try {
    const res = await httpClient.get(`/api/auth/${clerkId}`);

    return res.data;
  } catch (err) {
    console.error("Get Current user", err);

    if (err instanceof AxiosError) {
      return { error: err.response?.data };
    } else {
      return { error: "Something went wrong!" };
    }
  }
};

export const getMediaSources = async () => {
  const displays = await window.ipcRenderer.invoke("getSources");

  const enumerateDevices =
    await window.navigator.mediaDevices.enumerateDevices();

  const audioInputs = enumerateDevices.filter(
    (device) => device.kind === "audioinput"
  );

  return { displays, audioInputs };
};
