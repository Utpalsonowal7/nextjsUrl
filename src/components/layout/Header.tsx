"use client";
import { Menu, X, ChevronDown, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Theme from "../theme";
import Sidebar, { navItems } from "./Sidebar";
import UserInfoModel from "../ui/UserInfoModel";
import { currentUser } from "@/lib/features/auth/authSlice";
import { useAppSelector } from "@/lib/hooks";
export default function Header({ onCreate }: { onCreate: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const user = useAppSelector(currentUser);
  const pathname = usePathname();
  const title = navItems.find(item => pathname === item.href || pathname.startsWith(item.href + "/"))?.name || "Settings";
  useEffect(() => {
    if (mobileOpen) { dialog.current?.showModal(); const prior = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = prior; }; }
    dialog.current?.close();
  }, [mobileOpen]);
  function closeMenu() { setMobileOpen(false); menuButton.current?.focus(); }
  return <>
    <div className="fixed inset-x-0 top-0 z-30 flex h-18 items-center justify-between gap-3 border-b border-navB bg-dashBg/95 px-4 backdrop-blur-xl md:left-62.5 md:px-8">
      <div className="flex items-center gap-3"><button ref={menuButton} aria-label="Open navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)} className="rounded-lg p-2 hover:bg-cardBg md:hidden"><Menu className="size-5" /></button><p className="text-sm text-muted"><span className="hidden sm:inline">Workspace <span className="mx-2 opacity-40">/</span></span><span className="font-medium text-foreground">{title}</span></p></div>
      <div className="flex items-center gap-3"><button onClick={onCreate} aria-label="Create new" className="rounded-xl border border-navB p-2.5 hover:bg-cardBg"><Plus className="size-4" /></button><Theme /><button aria-expanded={userOpen} aria-label="Account menu" onClick={() => setUserOpen(!userOpen)} className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-cardBg"><span className="flex size-9 items-center justify-center rounded-full bg-rose-100 text-sm font-semibold text-rose-800">{(user?.name || "U").slice(0, 1).toUpperCase()}</span><span className="hidden text-sm font-medium sm:block">{user?.name?.split(" ")[0] || "Your account"}</span><ChevronDown className="size-4 text-muted" /></button></div>
    </div>
    <dialog ref={dialog} onCancel={closeMenu} onClick={event => { if (event.target === event.currentTarget) closeMenu(); }} aria-label="Navigation" className="fixed inset-0 m-0 h-dvh max-h-none w-[min(320px,90vw)] max-w-none bg-dashBg text-foreground backdrop:bg-black/40">
      <button onClick={closeMenu} aria-label="Close navigation" className="absolute right-3 top-3 rounded-lg p-2"><X className="size-5" /></button><Sidebar onNavigate={closeMenu} onCreate={() => { closeMenu(); onCreate(); }} />
    </dialog>
    {userOpen && <><button aria-label="Close account menu" className="fixed inset-0 z-30 cursor-default" onClick={() => setUserOpen(false)} /><div className="relative z-40"><UserInfoModel isOpen logo={(user?.name || "U").slice(0, 1)} name={user?.name || "Your account"} email={user?.email || ""} /></div></>}
  </>;
}
