import type { Metadata } from "next";
import Profile from "@/components/bio/Profile";
import { getPublicBio } from "@/lib/bio/public";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug} | LnkShrt`, description: "Discover links, projects, and more." };
}
export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPublicBio(encodeURIComponent(slug));
  return <main className="min-h-dvh [&>div]:min-h-dvh"><Profile page={page} /></main>;
}
