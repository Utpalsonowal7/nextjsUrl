import "server-only";
import { notFound } from "next/navigation";
import type { Envelope, PublicBio } from "./types";
export async function getPublicBio(path: string): Promise<PublicBio> {
  const base = (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BACkEND_URL || "http://localhost:8080/api/v1").replace(/\/$/, "");
  const response = await fetch(`${base}/public/bio-pages/${path}`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("The page service is temporarily unavailable.");
  return ((await response.json()) as Envelope<PublicBio>).data;
}
