/** Formats a game start time in the given IANA timezone, with the short
 *  TZ name appended (e.g. "7:30 PM EDT", "4:30 PM PDT", "9:30 AM GMT+9"). */
export function GameTime({ iso, tz }: { iso: string; tz: string }) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
  return <>{fmt.format(new Date(iso))}</>;
}
