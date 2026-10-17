"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
     ArrowUpRight,
     Copy,
     LayoutTemplate,
     Pencil,
     Plus,
     Search,
     Trash2,
} from "lucide-react";
import { bioApi, errorMessage } from "@/lib/bio/api";
import type { BioPage } from "@/lib/bio/types";
import {
     button,
     secondary,
     panel,
     input,
     Loading,
     Notice,
     PageHeading,
     Status,
} from "@/components/workspace/ui";
export default function BioPages() {
     const [pages, setPages] = useState<BioPage[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState("");
     const [message, setMessage] = useState("");
     const [search, setSearch] = useState("");
     const [busy, setBusy] = useState<number | null>(null);
     const load = useCallback(async () => {
          setLoading(true);
          setError("");
          try {
               setPages(await bioApi.list());
          } catch (err) {
               setError(errorMessage(err, "Could not load your bio pages."));
          } finally {
               setLoading(false);
          }
     }, []);
     useEffect(() => {
          let active = true;
          bioApi
               .list()
               .then((items) => {
                    if (active) setPages(items);
               })
               .catch((err) => {
                    if (active) setError(errorMessage(err));
               })
               .finally(() => {
                    if (active) setLoading(false);
               });
          return () => {
               active = false;
          };
     }, []);
     async function publish(page: BioPage) {
          setBusy(page.id);
          setError("");
          setMessage("");
          try {
               const updated = await bioApi.update(page.id, {
                    isPublished: !page.isPublished,
               });
               setPages((items) =>
                    items.map((p) => (p.id === page.id ? updated : p)),
               );
               setMessage(
                    updated.isPublished
                         ? "Your page is now live."
                         : "Page unpublished. Only you can view it in the editor.",
               );
          } catch (err) {
               setError(errorMessage(err));
          } finally {
               setBusy(null);
          }
     }
     async function remove(page: BioPage) {
          if (
               !window.confirm(
                    `Delete “${page.displayName}” and all its links? This cannot be undone.`,
               )
          )
               return;
          setBusy(page.id);
          setError("");
          try {
               await bioApi.remove(page.id);
               setPages((items) => items.filter((p) => p.id !== page.id));
               setMessage("Bio page deleted.");
          } catch (err) {
               setError(errorMessage(err));
          } finally {
               setBusy(null);
          }
     }
     async function copy(slug: string) {
          try {
               await navigator.clipboard.writeText(
                    `${window.location.origin}/b/${slug}`,
               );
               setMessage("Public page link copied.");
          } catch {
               setError(
                    "Copy failed. Open the public page and copy its address.",
               );
          }
     }
     const visible = pages.filter((p) =>
          `${p.displayName} ${p.slug}`
               .toLowerCase()
               .includes(search.toLowerCase()),
     );
     return (
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
               <PageHeading
                    eyebrow="Your corner of the internet"
                    title="One page. All your links."
                    description="Bring your projects, profiles, and favorite things together. Make it yours, then share it everywhere."
                    action={
                         <Link href="/pages/new" className={button}>
                              <Plus className="size-4" />
                              Create bio page
                         </Link>
                    }
               />
               {error && (
                    <Notice>
                         {error}{" "}
                         <button className="ml-2 underline" onClick={load}>
                              Retry
                         </button>
                    </Notice>
               )}
               {message && <Notice success>{message}</Notice>}
               {!loading && pages.length > 0 && (
                    <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                         <div className="flex gap-5 text-sm text-muted">
                              <span>
                                   <strong className="text-foreground">
                                        {pages.length}
                                   </strong>{" "}
                                   pages
                              </span>
                              <span>
                                   <strong className="text-emerald-600">
                                        {
                                             pages.filter((p) => p.isPublished)
                                                  .length
                                        }
                                   </strong>{" "}
                                   published
                              </span>
                         </div>
                         <label className="relative w-full sm:w-72">
                              <span className="sr-only">Search bio pages</span>
                              <Search className="absolute left-3 top-5 size-4 text-muted" />
                              <input
                                   className={`${input} mt-0 pl-10`}
                                   placeholder="Search your pages"
                                   value={search}
                                   onChange={(e) => setSearch(e.target.value)}
                              />
                         </label>
                    </div>
               )}
               {loading ? (
                    <Loading label="Loading your pages…" />
               ) : !pages.length && !error ? (
                    <div
                         className={`${panel} grid overflow-hidden md:grid-cols-2`}
                    >
                         <div className="p-8 sm:p-12">
                              <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-rose-500/10 text-[#c41e3a]">
                                   <LayoutTemplate />
                              </div>
                              <h2 className="text-2xl font-semibold tracking-tight">
                                   A home for everything you do.
                              </h2>
                              <p className="mt-4 text-sm leading-7 text-muted">
                                   Add your links, write a short introduction,
                                   and choose a look. You can keep it private
                                   until you’re ready to share.
                              </p>
                              <Link
                                   href="/pages/new"
                                   className={`${button} mt-7`}
                              >
                                   Create your first page
                                   <ArrowUpRight className="size-4" />
                              </Link>
                              <p className="mt-4 text-xs text-muted">
                                   Your page starts as a private draft.
                              </p>
                         </div>
                         <div
                              aria-hidden="true"
                              className="flex items-center justify-center bg-cardBg p-10"
                         >
                              <div className="w-60 rotate-3 rounded-[2rem] border-4 border-dashBg bg-background p-7 text-center shadow-xl">
                                   <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-rose-100 text-xl text-rose-700">
                                        Y
                                   </div>
                                   <p className="text-sm font-semibold">
                                        Your little world
                                   </p>
                                   <p className="mt-2 text-[10px] text-muted">
                                        Creator. Builder. A little bit of
                                        everything.
                                   </p>
                                   {[
                                        "My portfolio",
                                        "Latest project",
                                        "Let’s connect",
                                   ].map((text) => (
                                        <div
                                             key={text}
                                             className="mt-3 rounded-xl border border-navB bg-dashBg px-4 py-3 text-xs"
                                        >
                                             {text}
                                        </div>
                                   ))}
                              </div>
                         </div>
                    </div>
               ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                         {visible.map((page) => (
                              <article
                                   key={page.id}
                                   className={`${panel} overflow-hidden`}
                              >
                                   <div
                                        className={`flex h-32 items-center justify-center ${page.theme === "dark" ? "bg-slate-800" : "bg-rose-50 dark:bg-slate-800"}`}
                                   >
                                        <div className="flex size-16 items-center justify-center rounded-2xl bg-white text-2xl font-semibold text-rose-700 shadow-sm">
                                             {page.displayName
                                                  .slice(0, 1)
                                                  .toUpperCase()}
                                        </div>
                                   </div>
                                   <div className="p-5">
                                        <div className="flex items-start justify-between gap-3">
                                             <div className="min-w-0">
                                                  <h2 className="truncate font-semibold">
                                                       {page.displayName}
                                                  </h2>
                                                  <p className="mt-1 truncate text-xs text-muted">
                                                       /b/{page.slug}
                                                  </p>
                                             </div>
                                             <Status
                                                  published={page.isPublished}
                                             />
                                        </div>
                                        <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-muted">
                                             {page.description ||
                                                  "Your story is waiting to be told."}
                                        </p>
                                        <p className="mt-4 text-xs text-muted">
                                             {page.links.length} links ·{" "}
                                             {page.theme} theme
                                        </p>
                                        <div className="mt-5 flex flex-wrap items-center gap-2">
                                             <Link
                                                  href={`/pages/${page.id}/edit`}
                                                  className={`${secondary} flex-1`}
                                             >
                                                  <Pencil className="size-3.5" />
                                                  Edit page
                                             </Link>
                                             {page.isPublished && (
                                                  <>
                                                       <Link
                                                            href={`/b/${page.slug}`}
                                                            target="_blank"
                                                            aria-label={`View ${page.displayName}`}
                                                            className={`${secondary} px-3`}
                                                       >
                                                            <ArrowUpRight className="size-4" />
                                                       </Link>
                                                       <button
                                                            aria-label={`Copy link to ${page.displayName}`}
                                                            onClick={() =>
                                                                 copy(page.slug)
                                                            }
                                                            className={`${secondary} px-3`}
                                                       >
                                                            <Copy className="size-4" />
                                                       </button>
                                                  </>
                                             )}
                                        </div>
                                        <div className="mt-4 flex items-center justify-between border-t border-navB pt-4">
                                             <button
                                                  disabled={busy !== null}
                                                  onClick={() => publish(page)}
                                                  className="text-xs font-semibold text-short disabled:opacity-50"
                                             >
                                                  {busy === page.id
                                                       ? "Updating…"
                                                       : page.isPublished
                                                         ? "Unpublish"
                                                         : "Publish page"}
                                             </button>
                                             <button
                                                  disabled={busy !== null}
                                                  onClick={() => remove(page)}
                                                  aria-label={`Delete ${page.displayName}`}
                                                  className="rounded-lg p-2 text-muted hover:bg-red-500/10 hover:text-red-500"
                                             >
                                                  <Trash2 className="size-4" />
                                             </button>
                                        </div>
                                   </div>
                              </article>
                         ))}
                    </div>
               )}
               {!loading && pages.length > 0 && !visible.length && (
                    <p className="py-12 text-center text-sm text-muted">
                         No pages match “{search}”.
                    </p>
               )}
          </div>
     );
}
