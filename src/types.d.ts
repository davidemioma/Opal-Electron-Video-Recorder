export type ProfileType = {
  status: number;
  data: {
    id: string;
    clerkId: string;
    email: string;
    firstname: string | null;
    lastname: string | null;
    createdAt: Date;
    subscription: {
      plan: "PRO" | "FREE";
    } | null;
    studio: {
      id: string;
      screen: string | null;
      preset: "HD" | "SD";
      mic: string | null;
      camera: string | null;
      userId: string | null;
    } | null;
  };
};

export type DisplaysType = {
  id: string;
  name: string;
  thumbnail: string;
  display_id: string;
  appIcon: null;
}[];

export type AudioInputsType = {
  deviceId: string;
  type: string;
  label: string;
  groupId: string;
}[];

export type StudioSettings = {
  id: string;
  plan: "PRO" | "FREE";
  screen?: string | null;
  preset?: "HD" | "SD";
  audio?: string | null;
};
