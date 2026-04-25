"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/teams";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    setErrorMessage(null);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-md border border-led-green/30 bg-led-green/10 p-4 text-sm text-led-green">
        Check <span className="font-medium">{email}</span> for a magic link.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="block">
        <span className="block text-[11px] uppercase tracking-[0.2em] text-text-tertiary">Email</span>
        <div className="mt-1.5 flex items-center gap-2 rounded-md border border-border-base bg-bg-base/60 px-3 py-2 focus-within:border-led-amber/60">
          <Mail className="size-4 text-text-tertiary" />
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
          />
        </div>
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-md border border-led-amber/40 bg-led-amber-deep px-3 py-2 text-sm font-medium uppercase tracking-wider text-led-amber-soft transition-colors hover:bg-led-amber-deep/70 disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send magic link"}
      </button>

      {status === "error" && errorMessage ? (
        <div className="rounded-md border border-led-red/40 bg-led-red/10 p-3 text-xs text-led-red">
          {errorMessage}
        </div>
      ) : null}
    </form>
  );
}
