"use client";

import { NextUIProvider } from "@nextui-org/react";
import { useEffect } from "react";

export function UiProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    async function initGlobalShortcut() {
      const globalShortcut = await import("@tauri-apps/api/globalShortcut");
      const { appWindow } = await import("@tauri-apps/api/window");
      // const isRegistered = await globalShortcut.isRegistered(
      //   "CommandOrControl+,"
      // );

      // console.log("ctrl+,", isRegistered);

      globalShortcut.register("CommandOrControl+,", function () {
        appWindow.hide();
      });
    }

    async function destroyGlobalShortcut() {
      const globalShortcut = await import("@tauri-apps/api/globalShortcut");
      globalShortcut.unregisterAll();
    }
    initGlobalShortcut();

    return () => {
      destroyGlobalShortcut();
    };
  });

  return <NextUIProvider>{children}</NextUIProvider>;
}
