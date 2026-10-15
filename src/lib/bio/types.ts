export type BioTheme = "light" | "dark" | "system";
export interface BioLink { id?: number; title: string; url: string; isActive: boolean; position?: number }
export interface BioDraft {
  slug: string;
  displayName: string;
  description: string;
  avatarUrl: string | null;
  theme: BioTheme;
  isPublished: boolean;
  domainId: number | null;
  links: BioLink[];
}
export interface BioPage extends BioDraft { id: number; createdAt: string; updatedAt: string }
export type PublicBio = Pick<BioDraft, "slug" | "displayName" | "description" | "avatarUrl" | "theme"> & { links: Pick<BioLink, "id" | "title" | "url" | "position">[] };
export interface DnsRecord { type: string; name: string; value: string }
export interface Domain {
  id: number; domain: string; isVerified: boolean; verifiedAt: string | null; createdAt: string;
  dns: { ownership: DnsRecord; routing: DnsRecord };
  checks?: { ownership: boolean; routing: boolean };
}
export interface Envelope<T> { success: boolean; data: T; message: string }
