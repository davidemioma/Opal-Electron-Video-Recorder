import { AxiosError } from "axios";
import { httpClient } from "../axios";
import { StudioSettingsValidator } from "../validators/studio-settings";

export const updateStudioSettings = async ({
  id,
  values,
}: {
  id: string;
  values: StudioSettingsValidator;
}) => {
  try {
    const res = await httpClient.post(
      `/api/studio/${id}`,
      { ...values },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error("updateStudioSettings api", err);

    if (err instanceof AxiosError) {
      return { error: err.response?.data };
    } else {
      return { error: "Something went wrong!" };
    }
  }
};
