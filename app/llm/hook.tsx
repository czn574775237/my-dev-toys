import { useEffect, useState } from "react";
import { chatApi, ChatMessage, createMessage } from "./api";

type ChatCompletionOption = {
  key: string;
  prompts?: ChatMessage[];
  content: string | null;
  onUpdate?: (message: string) => void;
  onFinish?: (message: string) => void;
  onError?: (ex: Error) => void;
  timeout?: number;
};

/**
 * OpenAI Hooks，流式响应
 * @param content
 * @param param1
 * @returns
 */
export function useChatCompletion({
  key,
  content,
  prompts,
  onError,
  onFinish,
  onUpdate,
  timeout = 60000,
}: ChatCompletionOption) {
  const [isLoading, setLoading] = useState(false);
  const [completion, setCompletion] = useState<string>();
  const [error, setError] = useState<Error>();
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!content || content === "") {
      return;
    }
    setCompletion("");

    const userMessage = createMessage({
      role: "user",
      content,
    });

    setLoading(true);
    const sendMessages = prompts
      ? prompts.concat([userMessage])
      : [userMessage];

    const clearTimer = () => {
      if (timer) {
        clearTimeout(timer);
      }
    };

    timer = setTimeout(() => {
      setLoading(false);
      const error = new Error("服务响应超时");
      setError(error);
      onError?.(error);
    }, timeout);
    chatApi.llm.chat({
      messages: sendMessages,
      config: {
        ...chatApi.config().modelConfig,
        stream: true,
      },
      onUpdate(message) {
        setCompletion(message);
        onUpdate?.(message);
      },
      onFinish(message) {
        setLoading(false);
        onFinish?.(message);
        clearTimer();
      },
      onError(error) {
        setLoading(false);
        setError(error);
        onError?.(error);
        clearTimer();
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { isLoading, data: completion, error };
}
