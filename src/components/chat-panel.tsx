"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, MessageSquare, Send, X } from "lucide-react";
import { cn } from "@/lib/cn";

type Msg = { id: string; role: "user" | "assistant"; content: string; toolUses?: string[] };

export function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  async function send() {
    const text = draft.trim();
    if (!text || streaming) return;

    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text };
    const assistantId = crypto.randomUUID();
    const assistantMsg: Msg = { id: assistantId, role: "assistant", content: "", toolUses: [] };

    setMessages((m) => [...m, userMsg, assistantMsg]);
    setDraft("");
    setStreaming(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok || !res.body) {
        const errBody = await res.json().catch(() => ({ error: `Request failed (${res.status})` }));
        throw new Error(errBody.error || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const block of events) {
          const line = block.split("\n").find((l) => l.startsWith("data: "));
          if (!line) continue;
          const payload = JSON.parse(line.slice(6));

          if (payload.type === "text") {
            setMessages((m) =>
              m.map((msg) =>
                msg.id === assistantId ? { ...msg, content: msg.content + payload.text } : msg,
              ),
            );
          } else if (payload.type === "tool_use") {
            setMessages((m) =>
              m.map((msg) =>
                msg.id === assistantId
                  ? { ...msg, toolUses: [...(msg.toolUses ?? []), payload.name] }
                  : msg,
              ),
            );
          } else if (payload.type === "error") {
            setError(payload.message);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setStreaming(false);
    }
  }

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        role="dialog"
        aria-label="Ask Claude"
        aria-hidden={!open}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border-strong bg-bg-panel transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between border-b border-border-base px-4 py-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4 text-led-amber-soft" />
            <h2 className="font-display text-sm uppercase tracking-[0.25em] led-text">Ask Claude</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="rounded p-1 text-text-tertiary hover:bg-bg-elevated hover:text-text-primary"
          >
            <X className="size-4" />
          </button>
        </header>

        <div ref={scrollRef} className="scrollbar-thin flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? <Welcome onPick={(q) => setDraft(q)} /> : null}

          <div className="space-y-4">
            {messages.map((m) => (
              <Message key={m.id} msg={m} streaming={streaming && m === messages[messages.length - 1] && m.role === "assistant"} />
            ))}
          </div>

          {error ? (
            <div className="mt-4 rounded-md border border-led-red/40 bg-led-red/10 p-3 text-xs text-led-red">
              {error}
            </div>
          ) : null}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="border-t border-border-base p-3"
        >
          <div className="flex items-end gap-2 rounded-md border border-border-base bg-bg-base/60 p-2 focus-within:border-led-amber/60">
            <textarea
              ref={inputRef}
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Where can I watch the Sox game tonight?"
              className="max-h-32 flex-1 resize-none bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
            />
            <button
              type="submit"
              disabled={!draft.trim() || streaming}
              aria-label="Send message"
              className="rounded-md border border-led-amber/40 bg-led-amber-deep p-2 text-led-amber-soft transition-colors hover:bg-led-amber-deep/70 disabled:opacity-40"
            >
              <Send className="size-4" />
            </button>
          </div>
          <p className="mt-2 text-[10px] text-text-tertiary">
            Claude has today&apos;s games + web search. May make mistakes &mdash; verify game-time changes.
          </p>
        </form>
      </aside>
    </>
  );
}

function Message({ msg, streaming }: { msg: Msg; streaming: boolean }) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-lg border border-border-base bg-bg-elevated px-3 py-2 text-sm text-text-primary">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {msg.toolUses && msg.toolUses.length > 0 ? (
        <div className="flex items-center gap-1.5 text-[11px] text-text-tertiary">
          <Globe className="size-3" />
          Searching the web…
        </div>
      ) : null}
      <div className="text-sm leading-relaxed text-text-primary whitespace-pre-wrap">
        {msg.content}
        {streaming && msg.content.length === 0 ? (
          <span className="inline-block h-3 w-2 animate-pulse bg-led-amber-soft/70 align-middle" />
        ) : null}
      </div>
    </div>
  );
}

function Welcome({ onPick }: { onPick: (q: string) => void }) {
  const samples = [
    "Where can I watch the Sox game tonight?",
    "Who's playing in the Champions League today?",
    "Did the Bruins win last night?",
    "What time is the Patriots game on Sunday and what channel?",
  ];
  return (
    <div className="space-y-3 pb-4">
      <p className="text-sm text-text-secondary">
        Ask about scores, schedules, or where to watch any game in MLB, NFL, NBA, NHL, EPL, UCL, or MLS.
      </p>
      <div className="grid gap-1.5">
        {samples.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onPick(q)}
            className="rounded-md border border-border-base bg-bg-elevated px-3 py-2 text-left text-xs text-text-secondary transition-colors hover:border-led-amber/40 hover:text-text-primary"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
