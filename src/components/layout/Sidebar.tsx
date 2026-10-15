"use client";
import { House, Link2, QrCode, ChartColumn, NotepadText, Globe, Plus, Settings, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export const navItems = [
  { name: "Overview", icon: House, href: "/home" }, { name: "Links", icon: Link2, href: "/links" },
  { name: "QR codes", icon: QrCode, href: "/qr" }, { name: "Analytics", icon: ChartColumn, href: "/analytics" },
  { name: "Bio pages", icon: NotepadText, href: "/pages" }, { name: "Custom domains", icon: Globe, href: "/domain" },
];
export default function Sidebar({ onCreate, onNavigate }: { onCreate: () => void; onNavigate?: () => void }) {
  const pathname = usePathname();
  return <div className="flex h-full flex-col border-r border-navB bg-dashBg px-5 py-7">
    <Link href="/home" onClick={onNavigate} className="mb-8 flex items-center gap-2.5 px-2 text-xl font-bold tracking-tight"><span className="rounded-xl bg-[#c41e3a] p-2 text-white"><Link2 className="size-5" /></span>LnkShrt<span className="text-[#c41e3a]">.</span></Link>
    <button onClick={onCreate} className="mb-8 flex items-center justify-center gap-2 rounded-xl bg-[#c41e3a] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a91730]"><Plus className="size-4" />Create new</button>
    <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Your workspace</p>
    <nav aria-label="Main navigation" className="space-y-1">{navItems.map(({ name, icon: Icon, href }) => {
      const active = pathname === href || pathname.startsWith(`${href}/`);
      return <Link key={href} href={href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${active ? "bg-rose-50 font-semibold text-[#b41b35] dark:bg-rose-500/10 dark:text-rose-300" : "text-muted hover:bg-cardBg hover:text-foreground"}`}><Icon className="size-[18px]" />{name}</Link>;
    })}</nav>
    <div className="mt-auto pt-12"><div className="rounded-2xl border border-navB bg-background p-4"><p className="text-sm font-semibold">Small links. Big possibilities.</p><p className="mt-2 text-xs leading-5 text-muted">Give your audience one place to find everything you share.</p><Link href="/pages/new" onClick={onNavigate} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-short">Build a bio page<ArrowUpRight className="size-3.5" /></Link></div>
    <Link href="/setting" onClick={onNavigate} className="mt-5 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-muted hover:bg-cardBg"><Settings className="size-[18px]" />Settings</Link></div>
  </div>;
}
