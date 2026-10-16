import { ArrowUpRight, Link2 } from "lucide-react";
import type { PublicBio } from "@/lib/bio/types";
import { defaultDesign, safeWebUrl } from "@/lib/bio/utils";
import { LinkIcon, socialHref, socialIcons, socialNames } from "./icons";

export default function Profile({ page, preview = false }: { page: PublicBio; preview?: boolean }) {
  const design = page.design ?? defaultDesign;
  const socials = design.socials.filter(s => socialHref(s.platform, s.url));
  return <div data-bio-theme={page.theme} data-bio-preset={design.preset} data-bio-buttons={design.buttonStyle} className="bio-profile relative min-h-full overflow-hidden rounded-[inherit] px-6 py-12 text-center">
    <div aria-hidden="true" className="bio-decoration pointer-events-none absolute inset-x-0 top-0 h-48 opacity-60" />
    <div className="relative mx-auto max-w-md">
      {page.avatarUrl && safeWebUrl(page.avatarUrl) ?
        // Remote user-provided avatars are intentionally not passed through the Next image optimizer.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={page.avatarUrl} alt="" referrerPolicy="no-referrer" className="mx-auto mb-5 size-24 rounded-full border-4 border-white/40 object-cover shadow-md" /> :
        <div className="bio-avatar mx-auto mb-5 flex size-24 items-center justify-center rounded-full border-4 border-white/30 text-3xl font-semibold shadow-sm">{page.displayName.slice(0, 1).toUpperCase() || "Y"}</div>}
      <h1 className="break-words text-2xl font-bold tracking-tight">{page.displayName || "Your name"}</h1>
      <p className="mx-auto mt-3 max-w-sm whitespace-pre-wrap break-words text-sm leading-6 opacity-70">{page.description || (preview ? "A little introduction. A few great links. All in one place." : "")}</p>
      {socials.length > 0 && <div aria-label="Social profiles" className="mt-5 flex flex-wrap justify-center gap-2">{socials.map((social, index) => {
        const Icon = socialIcons[social.platform];
        const content = <><Icon aria-hidden="true" className="size-5" /><span className="sr-only">{socialNames[social.platform]}</span></>;
        const className = "bio-social inline-flex size-11 items-center justify-center rounded-full border transition hover:-translate-y-0.5";
        return preview ? <span key={index} className={className}>{content}</span> :
          <a key={index} href={socialHref(social.platform, social.url)!} target={social.platform === "email" ? undefined : "_blank"} rel="noopener noreferrer nofollow ugc" aria-label={socialNames[social.platform] + (social.platform === "email" ? "" : " (opens in a new tab)")} className={className}>{content}</a>;
      })}</div>}
      <div className="my-8 space-y-3">{page.links.filter(link => safeWebUrl(link.url)).map((link, index) => {
        const content = <><LinkIcon name={link.icon} /><span className="min-w-0 flex-1 break-words">{link.title}</span><ArrowUpRight aria-hidden="true" className="size-4 shrink-0 opacity-50" /></>;
        const className = "bio-link flex min-h-14 items-center gap-4 border px-5 py-4 text-left text-sm font-semibold transition hover:-translate-y-0.5";
        return preview ? <div key={link.id ?? index} className={className}>{content}</div> :
          <a key={link.id ?? index} href={link.url} target="_blank" rel="noopener noreferrer nofollow ugc" className={className}>{content}<span className="sr-only"> (opens in a new tab)</span></a>;
      })}</div>
      <p className="mt-12 inline-flex items-center gap-1.5 text-xs opacity-50"><Link2 className="size-3.5" />Made with LnkShrt</p>
    </div>
  </div>;
}
