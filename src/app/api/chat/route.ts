// src/app/api/chat/route.ts

import { NextRequest, NextResponse } from "next/server";
import { sendMessageToClaude } from "@/lib/ai/claude";
import { runBasicEngine } from "@/lib/basic/engine";
import { ChatRequest, ChatResponse, UserTier } from "@/types/chat";

// -------------------------
// Resolve user tier
// Phase 1/2: defaults to "free"
// Phase 3: replace with real auth + Supabase lookup
// -------------------------

async function resolveUserTier(_req: NextRequest): Promise<UserTier> {
  // --- Phase 2 hook ---
  // const user = await getSessionUser(req);
  // if (!user) return "free";
  // const profile = await getProfile(user.id);
  // return profile.plan_type as UserTier;

  return "free";
}

// -------------------------
// POST /api/chat
// -------------------------

export async function POST(
  req: NextRequest
): Promise<NextResponse<ChatResponse>> {
  try {
    const body: ChatRequest = await req.json();
    const { messages, mode } = body;

    // --- Validate messages ---
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { message: "", error: "Messages are required." },
        { status: 400 }
      );
    }

    // --- Validate mode ---
    if (!mode || (mode !== "study" && mode !== "career")) {
      return NextResponse.json(
        { message: "", error: "A valid mode is required: study or career." },
        { status: 400 }
      );
    }

    // --- Resolve user tier ---
    const tier = await resolveUserTier(req);

    // --- Route by tier ---
    if (tier === "premium") {
      // --- Premium: use Claude API ---
      const claudeMessages = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

      const claudeResponse = await sendMessageToClaude({
        mode,
        messages: claudeMessages,
      });

      // --- Phase 2 hook: save messages + increment usage ---
      // await saveMessages(conversationId, messages, claudeResponse);
      // await incrementUsage(userId, claudeResponse.inputTokens, claudeResponse.outputTokens);

      return NextResponse.json(
        { message: claudeResponse.content },
        { status: 200 }
      );
    }

    // --- Free: use NIRA Basic engine ---
    const engineMessages = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      }));

    const engineResponse = await runBasicEngine(engineMessages, mode);

    // --- Phase 2 hook: save messages + increment usage ---
    // await saveMessages(conversationId, messages, engineResponse);
    // await incrementUsage(userId);

    // --- Build response ---
    // Append upgrade prompt to message if present
    const finalMessage = engineResponse.upgradePrompt
      ? `${engineResponse.content}\n\n---\n${engineResponse.upgradePrompt}`
      : engineResponse.content;

    return NextResponse.json(
      {
        message: finalMessage,
        // source exposed for future frontend badge/indicator
        // source: engineResponse.source,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("[NIRA API ERROR]", error);

    return NextResponse.json(
      {
        message: "",
        error: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
