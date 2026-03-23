// src/src/chat.ts
    // -------------------------
    // Core chat types
    // -------------------------

    export type Mode = "study" | "career";

    export type Role = "user" | "assistant" | "system";

    export interface Message {
      id: string;
        role: Role;
          content: string;
            createdAt: Date;
            }

            export interface Conversation {
              id: string;
                mode: Mode;
                  messages: Message[];
                    createdAt: Date;
                    }

                    export interface ChatRequest {
                      messages: Pick<Message, "role" | "content">[];
                        mode: Mode;
                        }

                        export interface ChatResponse {
                          message: string;
                            error?: string;
                            }

                            // -------------------------
                            // User tier
                            // -------------------------

                            export type UserTier = "free" | "premium";

                            // -------------------------
                            // NIRA Basic engine types
                            // -------------------------

                            export type EngineSource =
                              | "cache"
                                | "knowledge_base"
                                  | "search"
                                    | "fallback";

                                    export interface EngineResponse {
                                      content: string;
                                        source: EngineSource;
                                          mode: Mode;
                                            cached: boolean;
                                              upgradePrompt?: string;
                                              }

                                              export interface KnowledgeEntry {
                                                keywords: string[];
                                                  mode: Mode;
                                                    answer: string;
                                                    }

                                                    export interface SearchResult {
                                                      title: string;
                                                        snippet: string;
                                                          url: string;
                                                          }

                                                          export interface SearchResponse {
                                                            success: boolean;
                                                              results: SearchResult[];
                                                                exhausted: boolean;
                                                                }