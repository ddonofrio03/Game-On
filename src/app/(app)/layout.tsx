import { AppShell } from "@/components/app-shell";
import { TimezoneSync } from "@/components/timezone-sync";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TimezoneSync />
      <AppShell>{children}</AppShell>
    </>
  );
}
