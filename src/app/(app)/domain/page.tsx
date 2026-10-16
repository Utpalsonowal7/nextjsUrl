"use client";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, ChevronDown, Copy, Globe2, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { domainApi, errorMessage } from "@/lib/bio/api";
import type { Domain, DnsRecord } from "@/lib/bio/types";
import { button, input, secondary, panel, Loading, Notice, PageHeading } from "@/components/workspace/ui";
export default function Domains() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [adding, setAdding] = useState(false);
  const [hostname, setHostname] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const load = useCallback(async () => { setLoading(true); setError(""); try { setDomains(await domainApi.list()); } catch (err) { setError(errorMessage(err)); } finally { setLoading(false); } }, []);
  useEffect(() => { void load(); }, [load]);
  async function add(event: React.FormEvent) {
    event.preventDefault(); setAdding(true); setError(""); setMessage("");
    try { const domain = await domainApi.create(hostname.trim()); setDomains(items => [domain, ...items]); setHostname(""); setOpen(domain.id); setMessage("Domain added. Add both DNS records below, then verify."); }
    catch (err) { setError(errorMessage(err)); } finally { setAdding(false); }
  }
  async function verify(domain: Domain) {
    setBusy(domain.id); setError(""); setMessage("");
    try {
      const updated = await domainApi.verify(domain.id);
      setDomains(items => items.map(d => d.id === domain.id ? updated : d));
      if (updated.isVerified) setMessage(`${domain.domain} is verified. You can now use it for links and bio pages.`);
      else setError(`DNS records do not match yet. ${updated.checks?.ownership ? "Ownership TXT matched." : "Ownership TXT missing or incorrect."} ${updated.checks?.routing ? "Routing confirmed." : "Routing check failed: CNAME did not match and the HTTPS routing proof was not confirmed."} DNS changes can take time; check the records and retry.`);
    } catch (err) { setError(errorMessage(err, "DNS check unavailable. Please retry shortly.")); } finally { setBusy(null); }
  }
  async function remove(domain: Domain) {
    if (!window.confirm(`Remove ${domain.domain}? Attached links or bio pages must be removed or detached first.`)) return;
    setBusy(domain.id); setError(""); setMessage("");
    try { await domainApi.remove(domain.id); setDomains(items => items.filter(d => d.id !== domain.id)); setMessage("Domain removed."); }
    catch (err) { setError(errorMessage(err)); } finally { setBusy(null); }
  }
  async function copy(value: string) { try { await navigator.clipboard.writeText(value); setMessage("DNS value copied."); } catch { setError("Could not copy. Select and copy the DNS value manually."); } }
  function record(record: DnsRecord, title: string, matched?: boolean) {
    return <div className="rounded-xl border border-navB bg-background p-4"><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-semibold">{title}</h3><span className="rounded-md bg-cardBg px-2 py-1 font-mono text-xs">{record.type}</span></div><dl className="space-y-4">{[["Name", record.name], ["Value", record.value]].map(([label, value]) => <div key={label}><dt className="mb-1 text-xs text-muted">{label}</dt><dd className="flex items-start justify-between gap-3"><code className="min-w-0 select-all break-all text-xs leading-6">{value}</code><button onClick={() => copy(value)} aria-label={`Copy ${record.type} ${label.toLowerCase()}`} className="shrink-0 rounded-lg p-2 hover:bg-cardBg"><Copy className="size-3.5" /></button></dd></div>)}</dl>{matched !== undefined && <p className={`mt-3 text-xs ${matched ? "text-emerald-600 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}`}>{matched ? "Record matched" : "Record not matched"}</p>}</div>;
  }
  const visible = domains.filter(d => d.domain.includes(search.toLowerCase()));
  return <div className="mx-auto max-w-6xl px-4 sm:px-8"><PageHeading eyebrow="Put your name on it" title="Links that feel like you." description="Connect your own domain for recognizable short links and a bio page that belongs to your brand." />
    <form onSubmit={add} className={`${panel} mb-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:p-6`}><label className="min-w-0 flex-1 text-sm font-semibold">Connect a domain<input className={input} required maxLength={253} value={hostname} onChange={e => setHostname(e.target.value)} placeholder="links.yourbrand.com" /><span className="mt-2 block text-xs font-normal text-muted">Enter a subdomain without https:// or a path.</span></label><button className={`${button} sm:mb-6`} disabled={adding}><Plus className="size-4" />{adding ? "Adding…" : "Add domain"}</button></form>
    {error && <Notice>{error}</Notice>}{message && <Notice success>{message}</Notice>}
    <div className="mb-5 flex flex-wrap items-center justify-between gap-4"><p className="text-sm font-semibold">Your domains <span className="ml-2 rounded-full bg-cardBg px-2 py-1 text-xs text-muted">{domains.length}</span></p><label className="relative w-full sm:w-64"><span className="sr-only">Search domains</span><Search className="absolute left-3 top-3.5 size-4 text-muted" /><input className={`${input} mt-0 pl-10`} placeholder="Search domains" value={search} onChange={e => setSearch(e.target.value)} /></label></div>
    {loading ? <Loading label="Loading domains…" /> : <div className="space-y-4">{visible.map(domain => <article key={domain.id} className={`${panel} overflow-hidden`}><div className="flex items-center gap-4 p-5"><span className="hidden rounded-xl bg-cardBg p-3 text-muted sm:block"><Globe2 className="size-5" /></span><div className="min-w-0 flex-1"><h2 className="break-all text-sm font-semibold sm:text-base">{domain.domain}</h2><p className={`mt-1.5 flex items-center gap-1.5 text-xs ${domain.isVerified ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}`}>{domain.isVerified && <CheckCircle2 className="size-3.5" />}{domain.isVerified ? "Ownership and routing verified" : "Waiting for verification"}</p></div><button aria-expanded={open === domain.id} onClick={() => setOpen(open === domain.id ? null : domain.id)} className={`${secondary} px-3`}><span className="hidden sm:inline">DNS settings</span><ChevronDown className={`size-4 transition ${open === domain.id ? "rotate-180" : ""}`} /></button></div>
      {open === domain.id && <div className="border-t border-navB p-5 sm:p-6"><p className="mb-5 text-sm leading-6 text-muted">Add both records at your DNS provider. Names below are full hostnames; your provider may ask for just the part before your domain.</p><div className="grid gap-4 lg:grid-cols-2">{domain.dns?.ownership ? record(domain.dns.ownership, "1. Prove domain ownership", domain.checks?.ownership) : <Notice>Ownership instructions are unavailable. Deploy the updated backend and reload.</Notice>}{domain.dns?.routing && record(domain.dns.routing, "2. Point it to LnkShrt", domain.checks?.routing)}</div>
        <p className="mt-5 rounded-xl bg-short/5 p-4 text-xs leading-6 text-muted">Proxying is supported. Keep both the ownership TXT and routing CNAME records. If your proxy hides the CNAME, we confirm routing with a fresh HTTPS challenge instead. Allow /.well-known/lnkshrt-domain-verification through without caching, redirects, or bot challenges. Your provider must have HTTPS ready and a correctly secured connection to our server. DNS-only domains need their own certificate at the server.</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><button disabled={busy !== null} onClick={() => verify(domain)} className={button}><RefreshCw className={`size-4 ${busy === domain.id ? "animate-spin" : ""}`} />{busy === domain.id ? "Checking…" : domain.isVerified ? "Recheck DNS" : "Verify DNS records"}</button><button disabled={busy !== null} onClick={() => remove(domain)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-500/10 dark:text-red-400"><Trash2 className="size-4" />Remove domain</button></div>
      </div>}
    </article>)}{!visible.length && <div className={`${panel} p-12 text-center`}><Globe2 className="mx-auto mb-4 size-10 text-muted" /><h2 className="font-semibold">{search ? "No matching domains" : "Make your links unmistakably yours."}</h2><p className="mt-2 text-sm text-muted">{search ? "Try another search." : "Add your first domain above to get started."}</p>{error && <button onClick={load} className={`${secondary} mt-4`}>Retry loading</button>}</div>}</div>}
  </div>;
}
