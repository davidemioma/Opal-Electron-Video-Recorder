import { toast } from "sonner";
import { ProfileType } from "@/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "@/lib/api/data";
import useMediaSources from "@/hooks/useMediaSources";
import MediaConfiguration from "./MediaConfiguration";
import { useUser, ClerkLoading, SignedIn } from "@clerk/clerk-react";

const Widget = () => {
  const { user } = useUser();

  const [profile, setProfile] = useState<ProfileType | null>(null);

  const { state, fetchMediaResources } = useMediaSources();

  useEffect(() => {
    if (!user || !user.id) return;

    fetchCurrentUser(user.id)
      .then((data) => {
        if (data.error) {
          toast.error(data.error);

          return;
        }

        setProfile(data);
      })
      .catch((err) => {
        toast.error(`Could not fetch user! ${err.message}`);

        setProfile(null);
      });

    fetchMediaResources();
  }, [user]);

  return (
    <div className="p-5 w-full h-full">
      <ClerkLoading>
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      </ClerkLoading>

      <SignedIn>
        {profile ? (
          <MediaConfiguration profile={profile} state={state} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        )}
      </SignedIn>
    </div>
  );
};

export default Widget;
