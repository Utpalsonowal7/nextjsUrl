import { ArrowUpRight, Link2 } from "lucide-react";
import type { PublicBio } from "@/lib/bio/types";
import { safeWebUrl } from "@/lib/bio/utils";

export default function Profile({ page, preview = false }: { page: PublicBio; preview?: boolean }) {
  return <div data-bio-theme={page.theme} className="bio-profile min-h-full rounded-[inherit] px-6 py-12 text-center">
    <div className="mx-auto max-w-md">
      {page.avatarUrl && safeWebUrl(page.avatarUrl) ?
        // Remote user-provided avatars are intentionally not passed through the Next image optimizer.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={page.avatarUrl} alt="" referrerPolicy="no-referrer" className="mx-auto mb-5 size-24 rounded-full border-4 border-white/40 object-cover shadow-md" /> :
        <div className="mx-auto mb-5 flex size-24 items-center justify-center rounded-full bg-rose-100 text-3xl font-semibold text-rose-700">{page.displayName.slice(0, 1).toUpperCase() || "Y"}</div>}
      <h1 className="text-2xl font-bold tracking-tight">{page.displayName || "Your name"}</h1>
      <p className="mx-auto mt-3 max-w-sm whitespace-pre-wrap break-words text-sm leading-6 opacity-70">{page.description || (preview ? "A little introduction. A few great links. All in one place." : "")}</p>
      <div className="my-8 space-y-3">{page.links.filter(link => safeWebUrl(link.url)).map((link, index) => preview ?
        <div key={link.id ?? index} className="bio-link flex min-h-14 items-center justify-between gap-4 rounded-xl border px-5 py-4 text-left text-sm font-semibold"><span className="break-words">{link.title}</span><ArrowUpRight className="size-4 shrink-0 opacity-50" /></div> :
        <a key={link.id ?? index} href={link.url} target="_blank" rel="noopener noreferrer nofollow ugc" className="bio-link flex min-h-14 items-center justify-between gap-4 rounded-xl border px-5 py-4 text-left text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md"><span className="break-words">{link.title}</span><ArrowUpRight className="size-4 shrink-0 opacity-50" /><span className="sr-only"> (opens in a new tab)</span></a>)}</div>
      <p className="mt-12 inline-flex items-center gap-1.5 text-xs opacity-50"><Link2 className="size-3.5" />Made with LnkShrt</p>
    </div>
  </div>;
}
