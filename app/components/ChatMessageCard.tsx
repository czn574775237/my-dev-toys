"use client";

import { Avatar, Card, Spinner } from "@nextui-org/react";
import { ChatMessage } from "../llm/api";

export type ChatMessageItem = {
  prompts: ChatMessage[];
  /** 你的问题  */
  content: string;
  createdAt?: number;
  /** 响应内容 */
  reply: string | undefined;
};

type ChatMessageCardProps = ChatMessageItem & {
  loading?: boolean;
  error?: string;
};

export function ChatMessageCard({
  content,
  reply,
  loading,
  error,
}: ChatMessageCardProps) {
  return (
    <div>
      <div className="flex p-2">
        <Avatar
          className="relative top-[4px]"
          size="sm"
          name="我"
          isBordered
          radius="lg"
        />
        <Card className="p-2 ml-2">{content}</Card>
        {loading && <Spinner size="sm" className="pl-2" />}
      </div>

      {reply && (
        <div className="flex p-2">
          <Card className="flex-1 p-2 mr-2 bg-blue-200">{reply ?? ""}</Card>
          <Avatar
            className="relative top-[4px]"
            size="sm"
            name="AI"
            isBordered
            color="primary"
            radius="lg"
          />
        </div>
      )}
      {error && (
        <div className="flex p-2">
          <Card className="flex-1 p-2 mr-2 bg-red-200">{error}</Card>
          <Avatar
            className="relative top-[4px]"
            size="sm"
            name="AI"
            isBordered
            color="primary"
            radius="lg"
          />
        </div>
      )}
    </div>
  );
}
