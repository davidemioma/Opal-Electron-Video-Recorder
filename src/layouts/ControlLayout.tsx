import React, { useState } from "react";
import { XIcon } from "lucide-react";
import { cn, onCloseApp } from "@/lib/utils";
import { UserButton } from "@clerk/clerk-react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const ControlLayout = ({ children, className }: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  window.ipcRenderer.on("hide-plugin", (event, payload) => {
    console.log(event);

    setIsVisible(payload.state);
  });

  return (
    <div
      className={cn(
        "bg-[#171717] text-white border-2 border-neutral-700 flex flex-col h-full w-full px-1 overflow-hidden rounded-3xl",
        className,
        isVisible && "invisible"
      )}
    >
      <div className="flex items-center justify-between p-5 draggable">
        <span className="non-draggable">
          <UserButton />
        </span>

        <XIcon
          className="non-draggable cursor-pointer text-gray-400 hover:text-white"
          size={20}
          onClick={onCloseApp}
        />
      </div>

      <div className="flex-1 h-0 overflow-auto">{children}</div>

      <div className="w-full flex p-5">
        <div className="flex items-center gap-2">
          <img src="/opal-logo.svg" alt="app logo" />

          <p className="text-white text-2xl">Opal</p>
        </div>
      </div>
    </div>
  );
};

export default ControlLayout;
