import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";
export const button = "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#c41e3a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a91730] disabled:cursor-not-allowed disabled:opacity-50";
export const secondary = "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-navB bg-dashBg px-4 py-2 text-sm font-medium text-foreground transition hover:bg-cardBg disabled:cursor-not-allowed disabled:opacity-50";
export const input = "mt-2 w-full min-w-0 rounded-xl border border-navB bg-dashBg px-3.5 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-short focus:ring-2 focus:ring-short/15 disabled:opacity-60";
export const panel = "rounded-2xl border border-navB bg-dashBg shadow-sm";
export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#c41e3a] dark:text-rose-400">{eyebrow}</p><h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1><p className="mt-3 max-w-xl text-sm leading-6 text-muted">{description}</p></div>{action}</div>;
}
export function Notice({ children, success = false }: { children: ReactNode; success?: boolean }) {
  return <div role={success ? "status" : "alert"} className={`mb-5 flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${success ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300"}`}>{success ? <CheckCircle2 className="mt-1 size-4 shrink-0" /> : <AlertCircle className="mt-1 size-4 shrink-0" />}<div className="min-w-0">{children}</div></div>;
}
export function Loading({ label = "Loading your workspace…" }: { label?: string }) {
  return <div role="status" className="flex min-h-64 items-center justify-center gap-3 text-sm text-muted"><LoaderCircle className="size-5 animate-spin" />{label}</div>;
}
export function Status({ published }: { published: boolean }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${published ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-cardBg text-muted"}`}><span className={`size-1.5 rounded-full ${published ? "bg-emerald-500" : "bg-muted"}`} />{published ? "Published" : "Draft"}</span>;
}
