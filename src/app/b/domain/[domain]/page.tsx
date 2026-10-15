import Profile from "@/components/bio/Profile";
import { getPublicBio } from "@/lib/bio/public";
export const dynamic = "force-dynamic";
export default async function DomainPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const page = await getPublicBio(`domain/${encodeURIComponent(domain)}`);
  return <main className="min-h-dvh [&>div]:min-h-dvh"><Profile page={page} /></main>;
}
