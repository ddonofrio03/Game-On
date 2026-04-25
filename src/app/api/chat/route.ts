import Anthropic from "@anthropic-ai/sdk";
import { NextResponse, type NextRequest } from "next/server";
import { fetchAllLeagues } from "@/lib/espn";
import { CHAT_SYSTEM_PROMPT, formatGamesContext } from "@/lib/anthropic-system";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ClientMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not set on the server." },
      { status: 503 },
    );
  }

  let body: { messages?: ClientMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const messages = (body.messages ?? []).filter(
    (m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.length > 0,
  );

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Last message must be from the user." }, { status: 400 });
  }

  const games = await fetchAllLeagues().catch(() => []);
  const context = formatGamesContext(games);

  const client = new Anthropic();

  const stream = client.messages.stream({
    model: "claude-opus-4-7",
    max_tokens: 4096,
    thinking: { type: "adaptive" },
    output_config: { effort: "medium" },
    system: [
      {
        type: "text",
        text: CHAT_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
      {
        type: "text",
        text: context,
      },
    ],
    tools: [{ type: "web_search_20260209", name: "web_search" }],
    messages,
  });

  const encoder = new TextEncoder();
  const sse = new ReadableStream<Uint8Array>({
    async start(controller) {
      function send(payload: unknown) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      }

      try {
        for await (const event of stream) {
          if (event.type === "content_block_start") {
            if (event.content_block.type === "server_tool_use") {
              send({ type: "tool_use", name: event.content_block.name });
            }
          } else if (event.type === "content_block_delta") {
            if (event.delta.type === "text_delta") {
              send({ type: "text", text: event.delta.text });
            }
          } else if (event.type === "message_delta") {
            if (event.delta.stop_reason && event.delta.stop_reason !== "end_turn") {
              send({ type: "stop", reason: event.delta.stop_reason });
            }
          }
        }
        send({ type: "done" });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        send({ type: "error", message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(sse, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
