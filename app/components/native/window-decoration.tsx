"use client";

import { Minus, Settings, X } from "lucide-react";
import { useRouter } from "next/navigation";

enum WindowDecorationEvent {
  Minimize,
  ToggleMaximize,
  Close,
  Hide,
  Setting,
}

/* eslint-disable @next/next/no-img-element */
export function WindowDecoration() {
  const router = useRouter();
  const handleWindowDecorationAction = async (event: WindowDecorationEvent) => {
    const { appWindow } = await import("@tauri-apps/api/window");
    if (event === WindowDecorationEvent.Close) {
      appWindow.close();
    } else if (event === WindowDecorationEvent.Minimize) {
      appWindow.minimize();
    } else if (event === WindowDecorationEvent.ToggleMaximize) {
      appWindow.toggleMaximize();
    } else if (event === WindowDecorationEvent.Hide) {
      appWindow.hide();
    } else if (event === WindowDecorationEvent.Setting) {
      router.push("/setting");
    }
  };

  return (
    <div
      data-tauri-drag-region
      className="h-[25px] bg-[#ffffff91] select-none flex justify-end fixed top-0 left-0 right-0 z-50"
    >
      <div
        className="inline-flex  justify-center items-center w-30 h-30 hover:bg-[#718d8d] px-1 cursor-pointer"
        onClick={() =>
          handleWindowDecorationAction(WindowDecorationEvent.Setting)
        }
      >
        <Settings size={16} />
      </div>
      <div
        className="inline-flex  justify-center items-center w-30 h-30 hover:bg-[#718d8d] px-1 cursor-pointer"
        onClick={() =>
          handleWindowDecorationAction(WindowDecorationEvent.Minimize)
        }
      >
        <Minus size={18} />
      </div>
      <div
        className="inline-flex justify-center items-center w-30 h-30 transition-all hover:bg-[#718d8d] px-1 cursor-pointer"
        onClick={() => handleWindowDecorationAction(WindowDecorationEvent.Hide)}
      >
        <X size={18} />
      </div>
    </div>
  );
}
