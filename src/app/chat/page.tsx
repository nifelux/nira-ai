// src/app/chat/page.tsx

"use client";

import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message, Mode, ChatRequest, ChatResponse } from "@/types/chat";
import Drawer from "@/components/chat/Drawer";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";

export default function ChatPage() {
  const [mode, setMode] = useState<Mode>("study");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // --- Handle mode switch ---
  function handleModeChange(newMode: Mode) {
    if (newMode === mode) return;
    setMode(newMode);
    setMessages([]);
    setError(null);
  }

  // --- Send message ---
  const handleSend = useCallback(
    async (content: string) => {
      if (isLoading) return;

      setError(null);

      const userMessage: Message = {
        id: uuidv4(),
        role: "user",
        content,
        createdAt: new Date(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsLoading(true);

      try {
        const payload: ChatRequest = {
          mode,
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        };

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data: ChatResponse = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || "Failed to get a response.");
        }

        const assistantMessage: Message = {
          id: uuidv4(),
          role: "assistant",
          content: data.message,
          createdAt: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong.";
        setError(message);
        setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, mode]
  );

  return (
    <div className="relative flex flex-col h-screen bg-gray-50 overflow-hidden">

      {/* ===================== */}
      {/* Floating Header       */}
      {/* ===================== */}
      <header className="
        fixed top-0 left-0 right-0 z-30
        bg-white/90 backdrop-blur-md
        border-b border-gray-200 shadow-sm
        px-4 py-3
      ">
        <div className="max-w-3xl mx-auto w-full flex items-center justify-between gap-3">

          {/* Menu button */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="
              w-9 h-9 flex items-center justify-center
              rounded-xl text-gray-500
              hover:bg-gray-100 hover:text-gray-800
              transition-colors focus:outline-none
              focus-visible:ring-2 focus-visible:ring-violet-500
            "
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">N</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-none">
                NIRA AI
              </h1>
              <p className="text-xs text-gray-400 leading-none mt-0.5">
                Learn. Build. Earn.
              </p>
            </div>
          </div>

          {/* Active mode badge */}
          <div className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
            ${mode === "study"
              ? "bg-violet-100 text-violet-700"
              : "bg-emerald-100 text-emerald-700"
            }
          `}>
            <span>{mode === "study" ? "📚" : "🚀"}</span>
            <span className="hidden sm:inline">
              {mode === "study" ? "Study" : "Career"}
            </span>
          </div>
        </div>
      </header>

      {/* ===================== */}
      {/* Side Drawer           */}
      {/* ===================== */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        mode={mode}
        onModeChange={handleModeChange}
      />

      {/* ===================== */}
      {/* Scrollable chat area  */}
      {/* Padded to clear fixed  */}
      {/* header and footer     */}
      {/* ===================== */}
      <main className="flex-1 overflow-y-auto pt-[64px] pb-[120px]">
        <ChatWindow messages={messages} isLoading={isLoading} />
      </main>

      {/* ===================== */}
      {/* Error banner          */}
      {/* ===================== */}
      {error && (
        <div className="fixed bottom-[88px] left-0 right-0 z-20 px-4">
          <div className="max-w-3xl mx-auto w-full">
            <div className="
              flex items-center justify-between gap-3
              bg-red-50 border border-red-200 text-red-700
              text-sm px-4 py-3 rounded-xl shadow-sm
            ">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                aria-label="Dismiss error"
                className="text-red-400 hover:text-red-600 transition-colors shrink-0"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== */}
      {/* Floating Footer Input */}
      {/* ===================== */}
      <footer className="
        fixed bottom-0 left-0 right-0 z-20
        bg-white/90 backdrop-blur-md
        border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]
      ">
        <ChatInput
          onSend={handleSend}
          isLoading={isLoading}
          mode={mode}
          disabled={false}
        />
      </footer>

    </div>
  );
}
