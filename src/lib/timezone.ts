import "server-only";
import { cookies } from "next/headers";
import { DISPLAY_TZ_COOKIE, DEFAULT_DISPLAY_TZ } from "./timezone-cookie";

function isValidTimezone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** IANA timezone for displaying game times to this viewer.
 *  Comes from a cookie the client sets on first paint; falls back to ET. */
export async function getDisplayTimezone(): Promise<string> {
  const store = await cookies();
  const raw = store.get(DISPLAY_TZ_COOKIE)?.value;
  if (raw && isValidTimezone(raw)) return raw;
  return DEFAULT_DISPLAY_TZ;
}
