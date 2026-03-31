// src/app/api/chat/route.ts

import { NextRequest, NextResponse } from "next/server";
import { runBasicEngine } from "@/lib/basic/engine";
import { ChatRequest, ChatResponse, UserTier } from "@/types/chat";
import { supabase } from "@/lib/db/supabaseClient";

// -------------------------
// Resolve userId and tier
// from Supabase session.
// ctx is retained here for
// future engine context passing.
// -------------------------

interface ResolvedContext {
  userId: string | null;
  tier: UserTier;
}

async function resolveContext(req: NextRequest): Promise<ResolvedContext> {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return { userId: null, tier: "free" };

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) return { userId: null, tier: "free" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("tier")
      .eq("id", user.id)
      .single();

    const tier = (profile?.tier ?? "free") as UserTier;
    return { userId: user.id, tier };
  } catch {
    return { userId: null, tier: "free" };
  }
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

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { message: "", error: "Messages are required." },
        { status: 400 }
      );
    }

    if (!mode || (mode !== "study" && mode !== "career")) {
      return NextResponse.json(
        { message: "", error: "A valid mode is required: study or career." },
        { status: 400 }
      );
    }

    // Resolve context — retained for future use
    // ctx.userId and ctx.tier will be passed to engine
    // once full auth integration is complete
    const ctx = await resolveContext(req);

    const engineMessages = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    // Pass ctx as optional third argument
    // engine.ts accepts it as _ctx?: Partial<EngineContext>
    const engineResponse = await runBasicEngine(
      engineMessages,
      mode,
      { userId: ctx.userId, tier: ctx.tier }
    );

    const finalMessage = engineResponse.upgradePrompt
      ? `${engineResponse.content}\n\n---\n${engineResponse.upgradePrompt}`
      : engineResponse.content;

    return NextResponse.json({ message: finalMessage }, { status: 200 });

  } catch (error) {
    console.error("[NIRA API ERROR]", error);
    return NextResponse.json(
      { message: "", error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
