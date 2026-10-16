export type BioTheme = "light" | "dark" | "system";
export type BioIcon = "link" | "globe" | "code" | "video" | "music" | "mail" | "shop" | "book" | "heart" | "download";
export type SocialPlatform = "github" | "linkedin" | "instagram" | "youtube" | "x" | "website" | "email";
export interface BioDesign {
  preset: "minimal" | "midnight" | "ocean" | "rose" | "forest" | "sunset";
  buttonStyle: "rounded" | "pill" | "outline" | "shadow";
  socials: { platform: SocialPlatform; url: string }[];
}
export interface BioLink { id?: number; icon?: BioIcon; title: string; url: string; isActive: boolean; position?: number }
export interface BioDraft {
  slug: string;
  displayName: string;
  description: string;
  avatarUrl: string | null;
  theme: BioTheme;
  design?: BioDesign;
  isPublished: boolean;
  domainId: number | null;
  links: BioLink[];
}
export interface BioPage extends BioDraft { id: number; createdAt: string; updatedAt: string }
export type PublicBio = Pick<BioDraft, "slug" | "displayName" | "description" | "avatarUrl" | "theme" | "design"> & { links: Pick<BioLink, "id" | "title" | "url" | "icon" | "position">[] };
export interface DnsRecord { type: string; name: string; value: string }
export interface Domain {
  id: number; domain: string; isVerified: boolean; verifiedAt: string | null; createdAt: string;
  dns: { ownership: DnsRecord; routing: DnsRecord };
  checks?: { ownership: boolean; routing: boolean; routingMethod?: "cname" | "https" | null };
}
export interface Envelope<T> { success: boolean; data: T; message: string }
