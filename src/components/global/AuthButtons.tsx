import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, useUser } from "@clerk/clerk-react";

const AuthButtons = () => {
  const { user } = useUser();

  if (user) return null;

  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex items-center gap-3">
        <SignInButton>
          <Button
            className="px-10 rounded-full hover:bg-gray-200"
            variant="outline"
          >
            Sign In
          </Button>
        </SignInButton>

        <SignUpButton>
          <Button className="px-10 rounded-full">Sign Up</Button>
        </SignUpButton>
      </div>
    </div>
  );
};

export default AuthButtons;
