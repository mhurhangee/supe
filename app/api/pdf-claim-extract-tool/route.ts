import { openai } from "@ai-sdk/openai";

import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  tool,
  UIMessage,
} from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const logAndTrim = (label: string, obj: any) => {
    console.log(`${label}:`, JSON.stringify(
      obj,
      (key, value) => {
        if (typeof value === 'string' && value.length > 100) {
          return value.substring(0, 100) + '...';
        }
        return value;
      },
      2
    ));
  };

  logAndTrim("messages", messages);
  const convertedMessages = convertToModelMessages(messages);
  logAndTrim("convertedMessages", convertedMessages);

  const stream = createUIMessageStream({
    execute({ writer }) {
      const result = streamText({
        model: openai.responses("gpt-4.1-mini"),
        messages: convertedMessages,
        tools: {
          getClaims: tool({
            description: "Extract claims from a patent or application.",
            inputSchema: z.object({
              claims: z.string(),
            }),
            execute: async ({ claims }, { toolCallId }) => {
              writer.write({
                type: "data-getClaims",
                data: {
                  claims: undefined,
                  loading: true,
                },
                id: toolCallId,
              });

              await new Promise(resolve => setTimeout(resolve, 5000));

              writer.write({
                type: "data-getClaims",
                data: {
                  claims,
                  loading: false,
                },
                id: toolCallId,
              });
              return {
                claims,
                loading: false,
              };
            },
          }),
        },
      });
      writer.merge(
        result.toUIMessageStream({
          onError: (error) => {
            if (error instanceof Error) {
              return error.message;
            }
            console.error(error);
            return "An unknown error occurred.";
          },
        }),
      );
    },
  });

  return createUIMessageStreamResponse({ stream });
}