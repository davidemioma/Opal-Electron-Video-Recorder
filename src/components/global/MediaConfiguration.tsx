import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateStudioSettings } from "@/lib/api/mutations";
import { ProfileType, DisplaysType, AudioInputsType } from "@/types";
import {
  StudioSettingsValidator,
  StudioSettingsScheme,
} from "@/lib/validators/studio-settings";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

type Props = {
  profile: ProfileType;
  state: {
    isPending: boolean;
    error: string | null;
    displays: DisplaysType;
    audioInputs: AudioInputsType;
  };
};

const MediaConfiguration = ({ profile, state }: Props) => {
  const form = useForm<StudioSettingsValidator>({
    resolver: zodResolver(StudioSettingsScheme),
    defaultValues: {
      audio: "",
      screen: "",
      preset: "SD",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-studio-settings"],
    mutationFn: async (values: {
      id: string;
      values: StudioSettingsValidator;
    }) => {
      const res = await updateStudioSettings(values);

      return res;
    },
    onSuccess: (data) => {
      if (data.error || data.status !== 200) {
        return toast.error(data.error);
      }

      return toast.success(data.message);
    },
    onError: (err) => {
      return toast.error(err.message || "Something went wrong!");
    },
  });

  const onSubmit = (values: StudioSettingsValidator) => {
    if (!profile.data.studio?.id) return;

    mutate({ id: profile.data.studio?.id, values });

    window.ipcRenderer.send("media-sources", {
      id: profile.data.studio?.id,
      plan: profile.data.subscription?.plan,
      ...values,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full h-full space-y-5"
      >
        {profile.data.firstname}
      </form>
    </Form>
  );
};

export default MediaConfiguration;
