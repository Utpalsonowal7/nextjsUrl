import { BookOpen, Code2, Download, Globe, Heart, Link2, Mail, Music, ShoppingBag, Video } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import type { BioIcon, SocialPlatform } from "@/lib/bio/types";
import { safeWebUrl } from "@/lib/bio/utils";
export const linkIcons = { link: Link2, globe: Globe, code: Code2, video: Video, music: Music, mail: Mail, shop: ShoppingBag, book: BookOpen, heart: Heart, download: Download };
export const socialIcons = { github: FaGithub, linkedin: FaLinkedinIn, instagram: FaInstagram, youtube: FaYoutube, x: FaXTwitter, website: Globe, email: Mail };
export const socialNames: Record<SocialPlatform, string> = { github: "GitHub", linkedin: "LinkedIn", instagram: "Instagram", youtube: "YouTube", x: "X", website: "Website", email: "Email" };
export function LinkIcon({ name }: { name?: BioIcon }) {
  const Icon = linkIcons[name ?? "link"] ?? Link2;
  return <Icon aria-hidden="true" className="size-5 shrink-0" />;
}
export function socialHref(platform: SocialPlatform, value: string) {
  if (platform === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !/[\r\n?#]/.test(value) ? "mailto:" + value : null;
  return safeWebUrl(value) ? value : null;
}
