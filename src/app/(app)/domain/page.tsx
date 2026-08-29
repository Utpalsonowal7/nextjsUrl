"use client";

import React from "react";
import { IoIosSearch, IoMdAdd } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";
import Link from "@/components/ui/Link";
import L from "next/link";

import { useState, useEffect } from "react";
import { LinksListSkeleton } from "@/components/Skeleton/LinkSkeleton";

import api from "@/api/axios";

import { userLinks, LinkProps, ApiResponse } from "@/types";

import { getLogo } from "@/utils/GetLogo";
import { AxiosError } from "axios";

import { useDispatch, useSelector } from "react-redux";
import { setLinks } from "@/lib/features/link/linkSlice";
import type { AppDispatch, RootState } from "@/lib/store";

import { dummyDomains } from "@/data/dummyData";
import AddDomainModal from "@/components/models/DomainModel";
import { title } from "process";

function Links() {
     const [open, setOpen] = useState<boolean>(false);
     const [loading, setLoading] = useState<boolean>(false);
     const [search, setSearch] = useState<string | null>("");
     // const [links, setLinks] = useState<userLinks[]>([]);
     const [err, setErr] = useState<string>("");

     const dispatch = useDispatch<AppDispatch>();

     const links = useSelector((state: RootState) => state.link.links);

     // useEffect(() => {
     //      const controller = new AbortController();

     //      const loadState = async () => {
     //           setErr("");
     //           setLoading(true);

     //           try {
     //                const res = await api.get<
     //                     ApiResponse<{ links: { links: userLinks[] } }>
     //                >("/links/user-links", {
     //                     signal: controller.signal,
     //                });

     //                const userLinks = res.data.data.links.links;

     //                const allLinks: LinkProps[] = userLinks.map((l) => ({
     //                     link: l,
     //                     image: getLogo(l.longUrl),
     //                }));

     //                dispatch(setLinks(allLinks));
     //           } catch (err) {
     //                const e = err as AxiosError<{ message?: string }>;

     //                if (
     //                     e.code === "ERR_CANCELED" ||
     //                     e.name === "CanceledError"
     //                ) {
     //                     return;
     //                }

     //                setErr(e.response?.data?.message || "Failed to load links");
     //           } finally {
     //                setLoading(false);
     //           }
     //      };

     //      const timer = setTimeout(() => {
     //           loadState();
     //      }, 1);

     //      return () => {
     //           clearTimeout(timer);
     //           controller.abort();
     //      };
     // }, [dispatch]);

     // const allLinks: LinkProps[] = links.map((l) => ({
     //      link: l,
     //      image: getLogo(l.longUrl),
     // }));

     // dispatch(setLinks(allLinks));

     return (
          <>
               <div className="flex flex-col  gap-6 px-3 md:px-16 mb-3">
                    {err && (
                         <div className="max-w-100 mx-auto text-2xl text-[#3a24a1] uppercase">
                              {err}
                         </div>
                    )}
                    <div className="flex flex-col gap-5 py-6 border-b border-navB">
                         <div className="flex items-center justify-between">
                              <h4 className="font-bold text-2xl dash-dashText">
                                   Domains
                              </h4>
                              <button
                                   className="bg-[#c41e3a] text-white font-medium py-1.5 px-2 rounded flex gap-2 items-center cursor-pointer"
                                   onClick={() => setOpen((pre) => !pre)}
                              >
                                   <IoMdAdd size={25} /> Add a domain
                              </button>
                         </div>
                         <div>
                              <p className="text-muted">
                                   Manage your custom domains for branded short
                                   links.
                              </p>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2">
                              <div className="bg-dashBg ">
                                   <form
                                        className="flex items-center gap-1 border border-navB py-3 px-3 rounded shadow-xs font-medium text-muted   focus-within:ring-2
                                        focus-within:ring-[#f59180]/30"
                                   >
                                        <span>
                                             <IoIosSearch />
                                        </span>
                                        <input
                                             type="text"
                                             name="search"
                                             value={search ?? ""}
                                             onChange={(
                                                  e: React.ChangeEvent<HTMLInputElement>,
                                             ) => setSearch(e.target.value)}
                                             placeholder="search domains"
                                             className="w-full outline-none text-sm "
                                        />
                                        <span className="w-20 text-end">
                                             {search ? (
                                                  <FaXmark
                                                       className="cursor-pointer"
                                                       onClick={() =>
                                                            setSearch("")
                                                       }
                                                  />
                                             ) : (
                                                  ""
                                             )}
                                        </span>
                                   </form>
                              </div>
                         </div>
                    </div>

                    {loading ? (
                         <LinksListSkeleton count={4} />
                    ) : (
                         <div className="flex flex-col gap-4">
                              {dummyDomains.map((domain) => (
                                   <div
                                        key={domain.id}
                                        className="border border-navB bg-dashBg rounded-lg p-4 md:p-5 flex items-center justify-between gap-4 hover:border-[#f59180]/50 transition"
                                   >
                                        <div className="flex items-center gap-4 min-w-0">
                                             <div className="w-11 h-11 shrink-0 rounded-lg border border-navB bg-background flex items-center justify-center">
                                                  <span className="text-xl">
                                                       🌐
                                                  </span>
                                             </div>

                                             <div className="min-w-0">
                                                  <div className="flex items-center gap-2 flex-wrap">
                                                       <h3 className="font-semibold text-base md:text-lg truncate">
                                                            {domain.domain}
                                                       </h3>

                                                       {domain.verified ? (
                                                            <span className="text-xs font-medium text-green-600 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">
                                                                 Verified
                                                            </span>
                                                       ) : (
                                                            <span className="text-xs font-medium text-yellow-600 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-full">
                                                                 Unverified
                                                            </span>
                                                       )}
                                                  </div>

                                                  <p className="text-xs text-muted mt-1">
                                                       Added {domain.createdAt}
                                                  </p>
                                             </div>
                                        </div>

                                        <div className="shrink-0">
                                             {domain.verified ? (
                                                  <button
                                                       className="border border-navB px-3 py-2 rounded text-sm font-medium
                              hover:bg-navB transition"
                                                  >
                                                       Manage
                                                  </button>
                                             ) : (
                                                  <button
                                                       className="bg-[#c41e3a] text-white px-3 py-2 rounded text-sm font-medium
                              hover:opacity-90 transition"
                                                  >
                                                       Verify
                                                  </button>
                                             )}
                                        </div>
                                   </div>
                              ))}
                         </div>
                    )}
               </div>

               <AddDomainModal
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    onAdd={(domain) => {
                         console.log("domain is:", domain);

                         // API later
                         // api.post("/domains", { domain });

                         setOpen(false);
                    }}
               />
          </>
     );
}

export default Links;
