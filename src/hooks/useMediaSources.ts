import { useState } from "react";
import { getMediaSources } from "@/lib/api/data";
import { DisplaysType, AudioInputsType } from "@/types";

const useMediaSources = () => {
  const [isPending, setIsPending] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [displays, setDisplays] = useState<DisplaysType>([]);

  const [audioInputs, setAudioInputs] = useState<AudioInputsType>([]);

  const fetchMediaResources = () => {
    setError(null);

    setIsPending(true);

    getMediaSources()
      .then((data) => {
        setDisplays(data?.displays);

        data?.audioInputs &&
          setAudioInputs(
            data?.audioInputs?.map((input) => ({
              deviceId: input.deviceId,
              type: input.kind,
              label: input.label,
              groupId: input.groupId,
            }))
          );
      })
      .catch((err) => {
        setError(`Something went wrong! ${err}`);
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  return {
    state: {
      isPending,
      error,
      displays,
      audioInputs,
    },
    fetchMediaResources,
  };
};

export default useMediaSources;
