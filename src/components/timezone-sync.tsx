"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DISPLAY_TZ_COOKIE } from "@/lib/timezone-cookie";

export function TimezoneSync() {
  const router = useRouter();
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return;
    const current = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${DISPLAY_TZ_COOKIE}=`))
      ?.slice(DISPLAY_TZ_COOKIE.length + 1);
    if (current === tz) return;
    document.cookie = `${DISPLAY_TZ_COOKIE}=${tz}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }, [router]);
  return null;
}
