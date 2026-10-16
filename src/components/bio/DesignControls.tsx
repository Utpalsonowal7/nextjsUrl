"use client";
import type { BioDesign, BioIcon, SocialPlatform } from "@/lib/bio/types";
import { input, secondary } from "../workspace/ui";
import { socialIcons, socialNames } from "./icons";
import { Plus, Trash2 } from "lucide-react";
export const presets = [
  { id: "minimal", name: "Minimal", colors: ["#faf9f6", "#ffffff", "#242735"] },
  { id: "midnight", name: "Midnight", colors: ["#12152b", "#222744", "#c4b5fd"] },
  { id: "ocean", name: "Ocean", colors: ["#e0f2fe", "#f0f9ff", "#075985"] },
  { id: "rose", name: "Rose", colors: ["#fff1f2", "#ffe4e6", "#9f1239"] },
  { id: "forest", name: "Forest", colors: ["#ecfdf5", "#d1fae5", "#065f46"] },
  { id: "sunset", name: "Sunset", colors: ["#fff7ed", "#ffedd5", "#9a3412"] },
] as const;
export default function DesignControls({ value, onChange }: { value: BioDesign; onChange: (value: BioDesign) => void }) {
  return <div className="mt-6 space-y-6">
    <div><h3 className="text-sm font-semibold">Color palette</h3><div aria-label="Color palette" role="group" className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{presets.map(preset =>
      <button type="button" key={preset.id} aria-pressed={value.preset === preset.id} onClick={() => onChange({ ...value, preset: preset.id })}
        className={"rounded-xl border p-3 text-left text-xs font-medium " + (value.preset === preset.id ? "border-short ring-1 ring-short" : "border-navB")}>
        <span className="mb-3 flex h-10 overflow-hidden rounded-lg">{preset.colors.map(color => <span key={color} className="flex-1" style={{ backgroundColor: color }} />)}</span>{preset.name}
      </button>)}</div><p className="mt-2 text-xs text-muted">Midnight stays dark. Other palettes follow your appearance setting.</p></div>
    <div><label className="block text-sm font-semibold">Button style<select aria-label="Button style" className={input} value={value.buttonStyle} onChange={e => onChange({ ...value, buttonStyle: e.target.value as BioDesign["buttonStyle"] })}>
      <option value="rounded">Rounded</option><option value="pill">Pill</option><option value="outline">Outlined</option><option value="shadow">Soft shadow</option>
    </select></label></div>
    <div><h3 className="text-sm font-semibold">Social icons</h3><p className="mt-2 text-xs leading-5 text-muted">Add up to 8 profiles. These appear as icons below your introduction.</p>
      <div className="mt-3 space-y-3">{value.socials.map((social, i) => {
        const Icon = socialIcons[social.platform];
        return <div key={i} className="rounded-xl border border-navB bg-background p-3">
          <div className="mb-3 flex items-center justify-between"><span className="flex items-center gap-2 text-xs font-semibold"><Icon aria-hidden="true" className="size-4" />SOCIAL {i + 1}</span><button type="button" aria-label={"Remove social " + (i + 1)} className="p-2 text-red-500" onClick={() => onChange({ ...value, socials: value.socials.filter((_, n) => n !== i) })}><Trash2 className="size-4" /></button></div>
          <label className="block text-xs font-medium">Platform<select aria-label={"Social " + (i + 1) + " platform"} className={input} value={social.platform} onChange={e => onChange({ ...value, socials: value.socials.map((item, n) => n === i ? { platform: e.target.value as SocialPlatform, url: "" } : item) })}>{Object.entries(socialNames).map(([key, label]) => <option value={key} key={key}>{label}</option>)}</select></label>
          <label className="mt-3 block text-xs font-medium">{social.platform === "email" ? "Email address" : "Profile URL"}<input aria-label={"Social " + (i + 1) + " address"} className={input} type={social.platform === "email" ? "email" : "url"} required maxLength={social.platform === "email" ? 254 : 2048} placeholder={social.platform === "email" ? "you@example.com" : "https://"} value={social.url} onChange={e => onChange({ ...value, socials: value.socials.map((item, n) => n === i ? { ...item, url: e.target.value } : item) })} /></label>
        </div>;
      })}</div>
      <button type="button" disabled={value.socials.length >= 8} className={secondary + " mt-3 w-full"} onClick={() => onChange({ ...value, socials: [...value.socials, { platform: "website", url: "" }] })}><Plus className="size-4" />Add social icon</button>
    </div>
  </div>;
}
export const iconLabels: Record<BioIcon, string> = { link: "Link", globe: "Website", code: "Code", video: "Video", music: "Music", mail: "Email", shop: "Shop", book: "Book", heart: "Heart", download: "Download" };
