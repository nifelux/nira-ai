// src/lib/ai/claude.ts

import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompts } from "@/lib/ai/prompts";
import { Mode } from "@/types/chat";

export interface ClaudeMessage {
  role: "user" | "assistant";
    content: string;
    }

    export interface ClaudeRequestOptions {
      mode: Mode;
        messages: ClaudeMessage[];
          maxTokens?: number;
          }

          export interface ClaudeResponse {
            content: string;
              inputTokens: number;
                outputTokens: number;
                }

                const client = new Anthropic({
                  apiKey: process.env.ANTHROPIC_API_KEY,
                  });

                  export async function sendMessageToClaude(
                    options: ClaudeRequestOptions
                    ): Promise<ClaudeResponse> {
                      const { mode, messages, maxTokens = 1024 } = options;

                        const systemPrompts = buildSystemPrompts(mode);

                          const systemContent = systemPrompts
                              .map((prompt) => ({ type: "text" as const, text: prompt }))
                                  .reduce((combined, block) => combined + "\n\n" + block.text, "");

                                    const response = await client.messages.create({
                                        model: "claude-sonnet-4-20250514",
                                            max_tokens: maxTokens,
                                                system: systemContent,
                                                    messages,
                                                      });

                                                        const firstBlock = response.content[0];

                                                          if (!firstBlock || firstBlock.type !== "text") {
                                                              throw new Error("Unexpected response format from Claude API");
                                                                }

                                                                  return {
                                                                      content: firstBlock.text,
                                                                          inputTokens: response.usage.input_tokens,
                                                                              outputTokens: response.usage.output_tokens,
                                                                                };
                                                                                }