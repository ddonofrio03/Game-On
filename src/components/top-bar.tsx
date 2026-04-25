"use client";

import Link from "next/link";
import { Logo, LogoMark } from "./logo";

export function TopBar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border-base bg-bg-base/90 px-4 py-3 backdrop-blur lg:px-8">
      <Link href="/scores" className="flex items-center gap-2 lg:hidden">
        <LogoMark className="size-8" />
        <Logo bare className="h-5 w-auto" />
      </Link>
      <h1 className="hidden font-display text-lg uppercase tracking-[0.25em] led-text lg:block">
        {title}
      </h1>
    </header>
  );
}
