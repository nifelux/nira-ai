// src/components/chat/Drawer.tsx

"use client";

import { useEffect } from "react";
import { Mode } from "@/types/chat";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

const MODES: { value: Mode; label: string; icon: string; description: string }[] = [
  {
    value: "study",
    label: "Study Mode",
    icon: "📚",
    description: "Learn topics, notes, quizzes, exam prep",
  },
  {
    value: "career",
    label: "Career Mode",
    icon: "🚀",
    description: "Resume, interviews, skills, freelancing",
  },
];

const OTHER_LINKS: { label: string; icon: string; href: string }[] = [
  {
    label: "Teachers",
    icon: "🎓",
    href: "#",
  },
  {
    label: "Developers",
    icon: "💻",
    href: "#",
  },
];

export default function Drawer({
  isOpen,
  onClose,
  mode,
  onModeChange,
}: DrawerProps) {
  // --- Lock body scroll when drawer is open on mobile ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // --- Close on Escape key ---
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* --- Backdrop --- */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-black/40 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        aria-hidden="true"
      />

      {/* --- Drawer panel --- */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* --- Drawer header --- */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">N</span>
            </div>
            <span className="text-sm font-bold text-gray-900">NIRA AI</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* --- Drawer body --- */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">

          {/* Modes section */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
              Modes
            </p>
            <div className="space-y-1">
              {MODES.map((m) => {
                const isActive = mode === m.value;
                return (
                  <button
                    key={m.value}
                    onClick={() => {
                      onModeChange(m.value);
                      onClose();
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left
                      transition-all duration-150
                      ${
                        isActive
                          ? "bg-violet-50 border border-violet-200"
                          : "hover:bg-gray-50 border border-transparent"
                      }
                    `}
                  >
                    <span className="text-lg">{m.icon}</span>
                    <div>
                      <p
                        className={`text-sm font-semibold leading-none ${
                          isActive ? "text-violet-700" : "text-gray-800"
                        }`}
                      >
                        {m.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 leading-snug">
                        {m.description}
                      </p>
                    </div>
                    {isActive && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-violet-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Others section */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
              Others
            </p>
            <div className="space-y-1">
              {OTHER_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left hover:bg-gray-50 transition-colors border border-transparent"
                >
                  <span className="text-lg">{link.icon}</span>
                  <p className="text-sm font-semibold text-gray-800">
                    {link.label}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* --- Drawer footer --- */}
        <div className="px-5 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            NIRA AI — Learn. Build. Earn.
          </p>
        </div>
      </aside>
    </>
  );
}
