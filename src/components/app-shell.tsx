"use client";

import { useState } from "react";
import { Sidebar, MobileNav } from "./sidebar";
import { ChatPanel } from "./chat-panel";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="flex min-h-svh">
      <Sidebar onAskClaude={() => setChatOpen(true)} />
      <div className="flex min-w-0 flex-1 flex-col pb-16 lg:pb-0">{children}</div>
      <MobileNav onAskClaude={() => setChatOpen(true)} />
      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
