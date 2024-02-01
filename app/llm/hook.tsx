import { useEffect, useState } from "react";
import { chatApi, ChatMessage, createMessage } from "./api";

type ChatCompletionOption = {
  prompts?: ChatMessage[];
  content: string | null;
  onUpdate?: (message: string) => void;
  onFinish?: (message: string) => void;
  onError?: (ex: Error) => void;
};

/**
 * OpenAI Hooks，流式响应
 * @param content
 * @param param1
 * @returns
 */
export function useChatCompletion({
  content,
  prompts,
  onError,
  onFinish,
  onUpdate,
}: ChatCompletionOption) {
  const [isLoading, setLoading] = useState(false);
  const [completion, setCompletion] = useState<string>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
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
      },
      onError(error) {
        setLoading(false);
        setError(error);
        onError?.(error);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return { isLoading, data: completion, error };
}
