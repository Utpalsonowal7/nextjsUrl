"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { LockKeyhole } from "lucide-react";
import { API_BASE_URL } from "@/api/config";
import { safeWebUrl } from "@/lib/bio/utils";
import { errorMessage } from "@/lib/bio/api";
import { button, input, panel, Loading, Notice } from "@/components/workspace/ui";
function Unlock() {
  const params = useSearchParams();
  const code = params.get("q");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try { const response = await axios.post(`${API_BASE_URL}/links/verify`, { q: code, password }, { timeout: 15000 }); const destination = response.data.data;
      if (typeof destination !== "string" || !safeWebUrl(destination)) throw new Error("Invalid destination");
      window.location.assign(destination);
    } catch (err) { setError(errorMessage(err, "Could not unlock this link. Please try again.")); setBusy(false); }
  }
  return <main className="flex min-h-dvh items-center justify-center px-5"><form onSubmit={submit} className={`${panel} w-full max-w-md p-8`}><LockKeyhole className="mb-5 size-8 text-[#c41e3a]" /><h1 className="text-2xl font-bold">A little privacy, please.</h1><p className="mb-6 mt-3 text-sm leading-6 text-muted">This link is protected. Enter the password shared by its owner to continue.</p>{error && <Notice>{error}</Notice>}{!code ? <Notice>The link code is missing. Ask the owner for the full link.</Notice> : <><label className="text-sm font-medium">Password<input type="password" autoComplete="current-password" required className={input} value={password} onChange={e => setPassword(e.target.value)} /></label><button disabled={busy} className={`${button} mt-5 w-full`}>{busy ? "Unlocking…" : "Unlock link"}</button></>}</form></main>;
}
export default function ProtectedLink() { return <Suspense fallback={<Loading />}><Unlock /></Suspense>; }
