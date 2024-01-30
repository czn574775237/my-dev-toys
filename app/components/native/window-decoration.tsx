"use client";
import { useEffect } from "react";
import { appWindow } from "@tauri-apps/api/window";

/* eslint-disable @next/next/no-img-element */
export function WindowDecoration() {
  useEffect(() => {
    document
      .getElementById("titlebar-minimize")
      ?.addEventListener("click", () => appWindow.minimize());
    document
      .getElementById("titlebar-maximize")
      ?.addEventListener("click", () => appWindow.toggleMaximize());
    document
      .getElementById("titlebar-close")
      ?.addEventListener("click", () => appWindow.close());
  }, []);

  return (
    <div
      data-tauri-drag-region
      className="h-30 bg-329ea3 select-none flex justify-end fixed top-0 left-0 right-0 z-50"
    >
      {/* <div
        className="inline-flex justify-center items-center w-30 h-30 hover:bg-[#5bbec3]"
        id="titlebar-minimize"
      >
        <img
          src="https://api.iconify.design/mdi:window-minimize.svg"
          alt="minimize"
        />
      </div>
      <div
        className="inline-flex justify-center items-center w-30 h-30 hover:bg-[#5bbec3]"
        id="titlebar-maximize"
      >
        <img
          src="https://api.iconify.design/mdi:window-maximize.svg"
          alt="maximize"
        />
      </div>
      <div
        className="inline-flex justify-center items-center w-30 h-30 hover:bg-[#5bbec3]"
        id="titlebar-close"
      >
        <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
      </div> */}
    </div>
  );
}
