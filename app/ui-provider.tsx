"use client";

import { NextUIProvider } from "@nextui-org/react";
import { useEffect } from "react";
import { isInApp } from "./utils";

export function UiProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    async function initGlobalShortcut() {
      const globalShortcut = await import("@tauri-apps/api/globalShortcut");
      const { appWindow } = await import("@tauri-apps/api/window");

      const HIDE_SHORTCUT = "CommandOrControl+Alt+[";
      const SHOW_SHORTCUT = "CommandOrControl+Alt+]";

      const isHideKeyRegistered = await globalShortcut.isRegistered(
        SHOW_SHORTCUT
      );
      const isShowKeyRegistered = await globalShortcut.isRegistered(
        SHOW_SHORTCUT
      );
      if (!isHideKeyRegistered) {
        globalShortcut.register(HIDE_SHORTCUT, () => {
          appWindow.hide();
        });
      } else {
        console.warn(`${HIDE_SHORTCUT} is registered`);
      }
      if (!isShowKeyRegistered) {
        globalShortcut.register(SHOW_SHORTCUT, () => {
          appWindow.show();
        });
      } else {
        console.warn(`${SHOW_SHORTCUT} is registered`);
      }
    }

    async function destroyGlobalShortcut() {
      const globalShortcut = await import("@tauri-apps/api/globalShortcut");
      globalShortcut.unregisterAll();
    }
    if (isInApp()) {
      initGlobalShortcut();
    }

    return () => {
      if (isInApp()) {
        destroyGlobalShortcut();
      }
    };
  }, []);

  return <NextUIProvider>{children}</NextUIProvider>;
}
