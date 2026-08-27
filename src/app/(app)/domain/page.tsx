"use client";

import React from "react";
import { IoIosSearch,IoMdAdd } from "react-icons/io";
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


function Links() {
     const [loading, setLoading] = useState<boolean>(false);
     const [search, setSearch] = useState<string | null>("");
     // const [links, setLinks] = useState<userLinks[]>([]);
     const [err, setErr] = useState<string>("");

     const dispatch = useDispatch<AppDispatch>();

     const links = useSelector((state: RootState) => state.link.links);

     useEffect(() => {
          const controller = new AbortController();

          const loadState = async () => {
               setErr("");
               setLoading(true);

               try {
                    const res = await api.get<
                         ApiResponse<{ links: { links: userLinks[] } }>
                    >("/links/user-links", {
                         signal: controller.signal,
                    });

                    const userLinks = res.data.data.links.links;

                    const allLinks: LinkProps[] = userLinks.map((l) => ({
                         link: l,
                         image: getLogo(l.longUrl),
                    }));

                    dispatch(setLinks(allLinks));
               } catch (err) {
                    const e = err as AxiosError<{ message?: string }>;

                    if (
                         e.code === "ERR_CANCELED" ||
                         e.name === "CanceledError"
                    ) {
                         return;
                    }

                    setErr(e.response?.data?.message || "Failed to load links");
               } finally {
                    setLoading(false);
               }
          };

          const timer = setTimeout(() => {
               loadState();
          }, 1);

          return () => {
               clearTimeout(timer);
               controller.abort();
          };
     }, [dispatch]);

     // const allLinks: LinkProps[] = links.map((l) => ({
     //      link: l,
     //      image: getLogo(l.longUrl),
     // }));

     // dispatch(setLinks(allLinks));

     return (
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
                         <L
                              href="/links/create"
                              className="bg-[#c41e3a] text-white font-medium py-1.5 px-2 rounded flex gap-2 items-center"
                         >
                              <IoMdAdd size={25} /> Add a domain
                         </L>
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
                                        placeholder="search links"
                                        className="w-full outline-none text-sm "
                                   />
                                   <span className="w-20 text-end">
                                        {search ? (
                                             <FaXmark
                                                  className="cursor-pointer"
                                                  onClick={() => setSearch("")}
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
                         {links.map((l) => {
                              return (
                                   <Link
                                        key={l.link.id}
                                        link={l.link}
                                        image={l.image ?? "/default-icon.png"}
                                   />
                              );
                         })}
                    </div>
               )}
          </div>
     );
}

export default Links;
