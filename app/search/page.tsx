"use client";

import {
  BreadcrumbItem,
  Breadcrumbs,
  Card,
  Chip,
  Input,
  Kbd,
  ScrollShadow,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

import { isInApp } from "../utils";
import { useChatCompletion } from "../llm/hook";
import { ChatMessage, createMessage } from "../llm/api";
import {
  ChatMessageCard,
  ChatMessageItem,
} from "../components/ChatMessageCard";
import { getAppConfig } from "../config";
import { useRouter } from "next/navigation";

type FeaturePromptItem = { id: string; name: string; prompt: string };

const featurePrompts: FeaturePromptItem[] = [
  {
    id: "translate",
    prompt: "翻译成中文",
    name: "翻译",
  },
  {
    id: "question",
    prompt: "",
    name: "问答",
  },
  {
    id: "completion",
    prompt: "内容续写",
    name: "补全",
  },
];

export default function Page() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState("");
  const [result, setResult] = useState<{ id: 1; text: "测试内容" }[]>([]);
  const [confirmSearchText, setConfirmSearchText] = useState("");
  const [hasToken, setHasToken] = useState(true);
  const [prompts, setPrompts] = useState<ChatMessage[]>([
    createMessage({ role: "system", content: "请用中文回答" }),
  ]);

  const router = useRouter();
  const [featurePrompt, setFeaturePrompt] = useState<FeaturePromptItem>(
    featurePrompts[0]
  );

  const {
    isLoading,
    data: reply,
    error,
  } = useChatCompletion({
    content: confirmSearchText,
    prompts: prompts.concat(
      createMessage({
        role: "system",
        content: featurePrompt.prompt,
      })
    ),
  });

  const getAppWindow = async () => {
    return await import("@tauri-apps/api/window");
  };

  const onSearchInputKeyUp = async function (e: KeyboardEvent) {
    console.log(e.code);
    if (e.code === "Enter") {
      if (isLoading) {
        return;
      }
      if (!hasToken) {
        return;
      }

      if (searchText !== "") {
        await onAdjustWindow();
        searchRef.current?.blur();

        onAskAi(searchText);
        setSearchText("");
      }
    }
  };

  const onAdjustWindow = async () => {
    const { appWindow, LogicalSize } = await getAppWindow();
    await appWindow.setSize(new LogicalSize(500, 500));
  };

  const onAskAi = async (text: string) => {
    setConfirmSearchText(text);
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
    };

    init();

    const { token } = getAppConfig();
    setHasToken(!!token);
  }, []);

  const onSelectFeaturePrompt = (key: string) => {
    const prompt = featurePrompts.find((t) => t.id === key);
    if (prompt) {
      setFeaturePrompt(prompt);
    }
  };

  return (
    <div>
      <Input
        autoFocus
        value={searchText}
        onChange={onChangeSearchText}
        size="lg"
        radius="none"
        ref={searchRef}
        placeholder="聊点什么..."
        onKeyUp={onSearchInputKeyUp}
        autoComplete="off"
        endContent={<Chip color="primary">{featurePrompt.name}</Chip>}
      />
      <div className="p-2">
        <Breadcrumbs
          size="sm"
          onAction={(key) => onSelectFeaturePrompt(key as string)}
          classNames={{
            list: "gap-2",
          }}
          itemClasses={{
            item: [
              "px-2 py-0.5 border-small border-default-400 rounded-small",
              "data-[current=true]:border-foreground data-[current=true]:bg-foreground data-[current=true]:text-background transition-colors",
              "data-[disabled=true]:border-default-400 data-[disabled=true]:bg-default-100",
            ],
            separator: "hidden",
          }}
        >
          {featurePrompts.map((t) => {
            return (
              <BreadcrumbItem key={t.id} isCurrent={featurePrompt.id === t.id}>
                {t.name}
              </BreadcrumbItem>
            );
          })}
        </Breadcrumbs>
      </div>
      <div className="fixed top-[150px]">
        {!hasToken && (
          <Card className="m-2 p-2 cursor-pointer">
            <p onClick={() => router.replace("/setting")}>请先配置 API Token</p>
          </Card>
        )}
      </div>

      <ScrollShadow className="h-[calc(100vh-140px)] overflow-y-auto">
        {confirmSearchText && (
          <ChatMessageCard
            loading={isLoading}
            prompts={prompts}
            reply={reply}
            content={confirmSearchText}
            error={error ? error.message : ""}
          />
        )}
      </ScrollShadow>
    </div>
  );
}
