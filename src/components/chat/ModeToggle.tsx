// src/components/chat/ModeToggle.tsx

"use client";

import { Mode } from "@/types/chat";

interface ModeToggleProps {
  mode: Mode;
    onModeChange: (mode: Mode) => void;
      disabled?: boolean;
      }

      const modes: { value: Mode; label: string; icon: string; description: string }[] = [
        {
            value: "study",
                label: "Study Mode",
                    icon: "📚",
                        description: "Learn topics, generate notes, prepare for exams",
                          },
                            {
                                value: "career",
                                    label: "Career Mode",
                                        icon: "🚀",
                                            description: "Build skills, prep for interviews, grow your career",
                                              },
                                              ];

                                              export default function ModeToggle({
                                                mode,
                                                  onModeChange,
                                                    disabled = false,
                                                    }: ModeToggleProps) {
                                                      return (
                                                          <div className="flex flex-col sm:flex-row gap-2 w-full">
                                                                {modes.map((m) => {
                                                                        const isActive = mode === m.value;

                                                                                return (
                                                                                          <button
                                                                                                      key={m.value}
                                                                                                                  onClick={() => !disabled && onModeChange(m.value)}
                                                                                                                              disabled={disabled}
                                                                                                                                          aria-pressed={isActive}
                                                                                                                                                      className={`
                                                                                                                                                                    flex-1 flex items-start gap-3 px-4 py-3 rounded-xl border text-left
                                                                                                                                                                                  transition-all duration-200 focus:outline-none focus-visible:ring-2
                                                                                                                                                                                                focus-visible:ring-violet-500
                                                                                                                                                                                                              ${
                                                                                                                                                                                                                              isActive
                                                                                                                                                                                                                                                ? "bg-violet-600 border-violet-600 text-white shadow-md"
                                                                                                                                                                                                                                                                  : "bg-white border-gray-200 text-gray-600 hover:border-violet-300 hover:bg-violet-50"
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                                                                                                                                                                                                                                                                                          `}
                                                                                                                                                                                                                                                                                                                    >
                                                                                                                                                                                                                                                                                                                                <span className="text-xl mt-0.5">{m.icon}</span>
                                                                                                                                                                                                                                                                                                                                            <div className="flex flex-col">
                                                                                                                                                                                                                                                                                                                                                          <span className={`text-sm font-semibold ${isActive ? "text-white" : "text-gray-800"}`}>
                                                                                                                                                                                                                                                                                                                                                                          {m.label}
                                                                                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                                                                                                                      <span className={`text-xs mt-0.5 ${isActive ? "text-violet-200" : "text-gray-400"}`}>
                                                                                                                                                                                                                                                                                                                                                                                                                      {m.description}
                                                                                                                                                                                                                                                                                                                                                                                                                                    </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                          </button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                  );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        })}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                              );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                              }