import type { BioDraft, BioDesign } from "./types";
export const defaultDesign: BioDesign = { preset: "minimal", buttonStyle: "rounded", socials: [] };
export function safeWebUrl(value: string) {
  try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password; }
  catch { return false; }
}
export function draftPayload(draft: BioDraft): BioDraft {
  return { slug: draft.slug.trim().toLowerCase(), displayName: draft.displayName.trim(), description: draft.description.trim(),
    avatarUrl: draft.avatarUrl?.trim() || null, theme: draft.theme, design: draft.design ?? { ...defaultDesign, socials: [] }, isPublished: draft.isPublished, domainId: draft.domainId,
    links: draft.links.map(({ title, url, isActive, icon }) => ({ icon: icon ?? "link", title: title.trim(), url: url.trim(), isActive })),
  };
}
