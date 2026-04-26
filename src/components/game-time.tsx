/** Always renders the time in US Eastern, with an "ET" suffix.
 *  Server-rendered (no hydration cost) — both server and client see the same
 *  output because we pin the timezone explicitly via Intl. */
const ET_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "numeric",
  minute: "2-digit",
});

export function GameTime({ iso }: { iso: string }) {
  return <>{ET_FORMATTER.format(new Date(iso))} ET</>;
}
