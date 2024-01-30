"use client";

import { Input, Kbd } from "@nextui-org/react";
import { KeyboardEvent, useEffect, useRef } from "react";
import { appWindow, LogicalSize } from "@tauri-apps/api/window";

export default function Page() {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      searchRef.current?.focus();
    }, 200);
  }, []);

  const onInputKeyUp = async function (e: KeyboardEvent) {
    console.log(e.code);
    if (e.code === "Enter") {
      searchRef.current?.blur();
      await appWindow.setSize(new LogicalSize(500, 200));
    }
  };

  return (
    <div>
      <Input
        size="lg"
        radius="none"
        ref={searchRef}
        label="向AI提出你的问题..."
        onKeyUp={onInputKeyUp}
      />
    </div>
  );
}
