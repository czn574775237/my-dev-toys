"use client";

import { Input, Kbd } from "@nextui-org/react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

import { isInApp } from "../utils";

export default function Page() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState("");
  const [result, setResult] = useState<{ id: 1; text: "测试内容" }[]>([]);

  const onFocusSearch = () => {
    searchRef.current?.focus();
  };

  const generateRows = (n: number) => {
    const arr = new Array(n);
    while (n > 0) {
      arr.push({ id: n, text: "text_" + n });
      n--;
    }
    return arr;
  };
  const getAppWindow = async () => {
    return await import("@tauri-apps/api/window");
  };

  const onSearchInputKeyUp = async function (e: KeyboardEvent) {
    const { appWindow, LogicalSize } = await getAppWindow();
    console.log(e.code);
    if (e.code === "Enter") {
      if (searchText !== "") {
        searchRef.current?.blur();
        setResult(generateRows(20));
        await appWindow.setSize(new LogicalSize(500, 500));
      }
    }
    if (e.ctrlKey && (e.key === "w" || e.key === "w")) {
      console.log("Ctrl + W Press");
      await appWindow.hide();
    }
  };

  const onClearSearchText = async function () {
    setSearchText("");
    setResult([]);
    const { appWindow, LogicalSize } = await import("@tauri-apps/api/window");
    await appWindow.setSize(new LogicalSize(500, 106));
  };
  const onChangeSearchText = (e: { target: { value: string } }) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const init = async () => {
      const { appWindow } = await getAppWindow();
      if (isInApp()) {
        await appWindow.show();
      }
      onFocusSearch();
    };

    init();
  }, []);

  return (
    <div>
      <Input
        value={searchText}
        onChange={onChangeSearchText}
        size="lg"
        radius="none"
        ref={searchRef}
        placeholder="Ask ai..."
        onKeyUp={onSearchInputKeyUp}
        isClearable
        autoComplete="off"
        onClear={onClearSearchText}
      />
      {result.length === 0 && (
        <div className="p-2 flex grid-cols-4 gap-4">
          <Kbd key="Ctrl">Enter [Search]</Kbd>
          <Kbd key="ctrl">Ctrl + W [Hide]</Kbd>
        </div>
      )}
      {result.length > 0 && (
        <div className="h-[430px] overflow-y-auto">
          {result.map((t) => {
            return (
              <p className="p-2" key={t.id}>
                {t.text}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}
