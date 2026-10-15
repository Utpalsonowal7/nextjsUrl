"use client";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
const subscribe = () => () => {};
export default function Theme() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  return <button aria-label="Toggle color theme" disabled={!mounted} onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="rounded-xl p-2.5 hover:bg-cardBg">{mounted && resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}</button>;
}
