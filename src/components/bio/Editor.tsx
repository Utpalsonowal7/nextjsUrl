"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUp, Check, ExternalLink, Plus, Save, Trash2 } from "lucide-react";
import { bioApi, domainApi, errorMessage } from "@/lib/bio/api";
import { draftPayload, safeWebUrl } from "@/lib/bio/utils";
import type { BioDraft, BioTheme, Domain } from "@/lib/bio/types";
import Profile from "./Profile";
import { button, input, secondary, panel, Notice, Loading, Status } from "../workspace/ui";
const blank: BioDraft = { slug: "", displayName: "", description: "", avatarUrl: null, theme: "light", isPublished: false, domainId: null, links: [] };
export default function Editor({ id }: { id?: string }) {
  const router = useRouter();
  const [draft, setDraft] = useState<BioDraft>(blank);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [domainError, setDomainError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    Promise.allSettled([id ? bioApi.get(id) : Promise.resolve(blank), domainApi.list()]).then(([page, domainList]) => {
      if (!active) return;
      if (page.status === "fulfilled") { setDraft(draftPayload(page.value)); setLoadFailed(false); setError(""); }
      else { setLoadFailed(true); setError(errorMessage(page.reason, "Could not load this page.")); }
      if (domainList.status === "fulfilled") { setDomains(domainList.value); setDomainError(""); }
      else setDomainError("Domains could not be loaded. Your current domain will be preserved.");
      setLoading(false);
    });
    return () => { active = false; };
  }, [id, revision]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function change(patch: Partial<BioDraft>) { setDraft(value => ({ ...value, ...patch })); setDirty(true); setMessage(""); }
  function changeLink(index: number, patch: Partial<BioDraft["links"][number]>) { change({ links: draft.links.map((link, i) => i === index ? { ...link, ...patch } : link) }); }
  function move(index: number, offset: number) { const links = [...draft.links]; [links[index], links[index + offset]] = [links[index + offset], links[index]]; change({ links }); }
  async function save(event: React.FormEvent) {
    event.preventDefault(); setError(""); setMessage("");
    const payload = draftPayload(draft);
    if ((payload.avatarUrl && !safeWebUrl(payload.avatarUrl)) || payload.links.some(link => !safeWebUrl(link.url))) { setError("Use HTTP or HTTPS URLs without embedded usernames or passwords."); return; }
    setSaving(true);
    try {
      const saved = id ? await bioApi.update(id, payload) : await bioApi.create(payload);
      setDraft(draftPayload(saved)); setDirty(false); setMessage(saved.isPublished ? "Saved. Your page is live." : "Draft saved. It is only visible to you.");
      if (!id) router.replace(`/pages/${saved.id}/edit`);
    } catch (err) { setError(errorMessage(err)); } finally { setSaving(false); }
  }
  function leave() { if (!dirty || window.confirm("Leave without saving your changes?")) router.push("/pages"); }
  if (loading) return <Loading label="Opening your page editor…" />;
  if (loadFailed) return <div className="mx-auto max-w-3xl px-6"><Notice>{error}</Notice><button className={secondary} onClick={() => { setLoading(true); setRevision(value => value + 1); }}>Retry</button><Link href="/pages" className="ml-4 text-sm underline">Back to pages</Link></div>;
  return <div className="mx-auto max-w-6xl px-4 sm:px-8">
    <button onClick={leave} className="mb-6 flex items-center gap-2 text-sm text-muted hover:text-foreground"><ArrowLeft className="size-4" />All bio pages</button>
    <div className="mb-7 flex flex-wrap items-center justify-between gap-4"><div><div className="flex items-center gap-3"><h1 className="text-3xl font-bold tracking-tight">{id ? "Make it yours." : "Your next chapter starts here."}</h1></div><p className="mt-3 text-sm text-muted">A little about you. Everything worth sharing.</p></div><Status published={draft.isPublished} /></div>
    {error && <Notice>{error}</Notice>}{message && <Notice success>{message}</Notice>}
    <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
      <form onSubmit={save} className="min-w-0"><fieldset disabled={saving} className="min-w-0 space-y-6">
        <section className={`${panel} p-5 sm:p-7`}><p className="text-xs font-semibold uppercase tracking-wider text-muted">01 / Profile</p><h2 className="mt-2 text-lg font-semibold">Introduce yourself</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2"><label className="text-sm font-medium">Display name<input className={input} required maxLength={100} value={draft.displayName} onChange={e => change({ displayName: e.target.value })} placeholder="Your name or brand" /></label><label className="text-sm font-medium">Page address<input aria-label="Page address" className={input} required minLength={3} maxLength={50} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={draft.slug} onChange={e => change({ slug: e.target.value.toLowerCase() })} placeholder="your-name" /><span className="mt-2 block text-xs font-normal text-muted">/b/{draft.slug || "your-name"} · lowercase letters, numbers, hyphens</span></label></div>
          <label className="mt-5 block text-sm font-medium">About you<textarea className={input} rows={3} maxLength={500} value={draft.description} onChange={e => change({ description: e.target.value })} placeholder="What do you make, love, or want to share?" /><span className="mt-1 block text-right text-xs font-normal text-muted">{draft.description.length}/500</span></label>
          <label className="mt-4 block text-sm font-medium">Profile image URL <span className="font-normal text-muted">(optional)</span><input type="url" className={input} maxLength={2048} value={draft.avatarUrl || ""} onChange={e => change({ avatarUrl: e.target.value || null })} placeholder="https://example.com/your-photo.jpg" /></label>
        </section>
        <section className={`${panel} p-5 sm:p-7`}><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-muted">02 / Links</p><h2 className="mt-2 text-lg font-semibold">Give them somewhere to go</h2></div><span className="text-xs text-muted">{draft.links.length}/50</span></div>
          <p className="mt-3 text-sm leading-6 text-muted">Reorder with the arrows. Switch a link off to hide it from your public page.</p>
          <div className="mt-5 space-y-4">{draft.links.map((link, index) => <div key={index} className="rounded-xl border border-navB bg-background p-4">
            <div className="mb-3 flex items-center justify-between"><span className="text-xs font-semibold text-muted">LINK {index + 1}</span><div className="flex gap-1"><button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Move link ${index + 1} up`} className="rounded-lg p-2 hover:bg-cardBg disabled:opacity-25"><ArrowUp className="size-4" /></button><button type="button" disabled={index === draft.links.length - 1} onClick={() => move(index, 1)} aria-label={`Move link ${index + 1} down`} className="rounded-lg p-2 hover:bg-cardBg disabled:opacity-25"><ArrowDown className="size-4" /></button><button type="button" onClick={() => change({ links: draft.links.filter((_, i) => i !== index) })} aria-label={`Remove link ${index + 1}`} className="rounded-lg p-2 text-red-500 hover:bg-red-500/10"><Trash2 className="size-4" /></button></div></div>
            <label className="block text-xs font-medium">Link title<input className={input} required maxLength={100} placeholder="My portfolio" value={link.title} onChange={e => changeLink(index, { title: e.target.value })} /></label><label className="mt-3 block text-xs font-medium">Destination URL<input type="url" className={input} required maxLength={2048} placeholder="https://example.com" value={link.url} onChange={e => changeLink(index, { url: e.target.value })} /></label><label className="mt-4 flex items-center gap-2 text-xs text-muted"><input type="checkbox" className="size-4 accent-[#c41e3a]" checked={link.isActive} onChange={e => changeLink(index, { isActive: e.target.checked })} />Visible on public page</label>
          </div>)}</div>
          <button type="button" disabled={draft.links.length >= 50} onClick={() => change({ links: [...draft.links, { title: "", url: "", isActive: true }] })} className={`${secondary} mt-5 w-full border-dashed`}><Plus className="size-4" />Add a link</button>
        </section>
        <section className={`${panel} p-5 sm:p-7`}><p className="text-xs font-semibold uppercase tracking-wider text-muted">03 / Make it yours</p><h2 className="mt-2 text-lg font-semibold">Appearance & publishing</h2><div role="group" aria-label="Page theme" className="mt-5 grid grid-cols-3 gap-3">{(["light", "dark", "system"] as BioTheme[]).map(theme => <button type="button" key={theme} aria-pressed={draft.theme === theme} onClick={() => change({ theme })} className={`rounded-xl border p-4 text-sm capitalize ${draft.theme === theme ? "border-short bg-short/5 ring-1 ring-short" : "border-navB"}`}><span className={`mb-3 block h-8 rounded-md border border-navB ${theme === "light" ? "bg-white" : theme === "dark" ? "bg-slate-900" : "bg-linear-to-r from-white from-50% to-slate-900 to-50%"}`} />{theme}</button>)}</div>
          <label className="mt-6 block text-sm font-medium">Custom domain<select aria-label="Custom domain" className={input} disabled={!!domainError} value={draft.domainId ?? ""} onChange={e => change({ domainId: e.target.value ? Number(e.target.value) : null })}><option value="">Use my LnkShrt page address</option>{domains.filter(d => d.isVerified || d.id === draft.domainId).map(d => <option key={d.id} value={d.id} disabled={!d.isVerified}>{d.domain}{!d.isVerified ? " (needs verification)" : ""}</option>)}</select></label>
          <p className="mt-2 text-xs leading-5 text-muted">{domainError || "Only your verified domains can be attached. HTTPS must also be enabled on your host."} <Link href="/domain" className="text-short underline">Manage domains</Link></p>
          <label className="mt-6 flex items-start gap-3 rounded-xl border border-navB bg-background p-4"><input type="checkbox" checked={draft.isPublished} onChange={e => change({ isPublished: e.target.checked })} className="mt-1 size-4 accent-[#c41e3a]" /><span><span className="block text-sm font-semibold">Publish this page</span><span className="mt-1 block text-xs leading-5 text-muted">Apply with Save changes. Unpublished pages are private.</span></span></label>
        </section>
        <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-navB bg-dashBg/95 p-4 shadow-lg backdrop-blur-lg"><span aria-live="polite" className="flex items-center gap-2 text-xs text-muted">{dirty ? "Unsaved changes" : <><Check className="size-4 text-emerald-500" />{id ? "All changes saved" : "Ready when you are"}</>}</span><button type="submit" className={button}><Save className="size-4" />{saving ? "Saving…" : id ? "Save changes" : "Create page"}</button></div>
      </fieldset></form>
      <aside className="xl:sticky xl:top-24"><div className="mb-4 flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">Live preview</p>{id && draft.isPublished && !dirty && <Link href={`/b/${draft.slug}`} target="_blank" className="flex items-center gap-1 text-xs text-short">View live<ExternalLink className="size-3" /></Link>}</div><div className="mx-auto max-w-[340px] overflow-hidden rounded-[2.5rem] border-[8px] border-cardBorder shadow-xl"><Profile preview page={{ ...draft, links: draft.links.filter(link => link.isActive) }} /></div><p className="mt-4 text-center text-xs leading-5 text-muted">A preview of what your visitors will see.<br />Changes go live after you save.</p></aside>
    </div>
  </div>;
}
