import { toast } from "sonner";
import { Headphones, Loader2, Monitor, Settings2 } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";

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
      audio: profile.data.studio?.mic || state.audioInputs?.[0]?.deviceId,
      screen: profile.data.studio?.screen || state.displays?.[0]?.id,
      preset: profile.data.studio?.preset,
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
        className="w-full h-full relative space-y-5"
      >
        {isPending && (
          <div className="absolute inset-0 w-full h-full z-50 bg-black/80 flex items-center justify-center rounded-2xl">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        )}

        <div className="w-full flex items-center gap-5">
          <Monitor fill="#575655" color="#575655" size={36} />

          <FormField
            control={form.control}
            name="screen"
            render={({ field }) => (
              <FormItem className="flex-1">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a screen display" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="bg-[#171717] text-white">
                    {state.displays.map((display, key) => (
                      <SelectItem key={key} value={display.id}>
                        {display.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="w-full flex items-center gap-5">
          <Headphones color="#575655" size={36} />

          <FormField
            control={form.control}
            name="audio"
            render={({ field }) => (
              <FormItem className="flex-1">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a audio type" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="bg-[#171717] text-white">
                    {state.audioInputs.map((device, key) => (
                      <SelectItem key={key} value={device.deviceId}>
                        {device.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="w-full flex items-center gap-5">
          <Settings2 color="#575655" size={36} />

          <FormField
            control={form.control}
            name="preset"
            render={({ field }) => (
              <FormItem className="flex-1">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a preset" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="bg-[#171717] text-white">
                    <SelectItem
                      value="HD"
                      disabled={profile.data.subscription?.plan === "FREE"}
                    >
                      1080p{" "}
                      {profile.data.subscription?.plan === "FREE" &&
                        "(Upgrade to PRO plan)."}
                    </SelectItem>

                    <SelectItem value="SD">720p</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="bg-muted w-[120px] flex items-center justify-center text-black hover:bg-muted-foreground disabled:opacity-75"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
        </Button>
      </form>
    </Form>
  );
};

export default MediaConfiguration;
