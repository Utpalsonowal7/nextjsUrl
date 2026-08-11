"use client";

import React from "react";
import { IoIosSearch } from "react-icons/io";
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

export const links = [
     {
          id: 1,
          desc: "Prisma Client API | Prisma Documentation",
          shortLink: "https://lnkshrt.in/github",
          longUrl: "https://github.com/utpalsonowal/lnkshrt",
     },
     {
          id: 2,
          desc: "Oppo Goat Sale July 26 Store Online - Buy Oppo Goat Sale July 26 Online at Best Price in India | Flipkart.com",
          shortLink: "https://lnkshrt.in/vercel",
          longUrl: "https://vercel.com/dashboard",
     },
     {
          id: 3,
          desc: "Official React documentation covering the fundamentals and advanced concepts.",
          shortLink: "https://lnkshrt.in/react",
          longUrl: "https://react.dev/learn",
     },
     {
          id: 4,
          desc: "Learn how to build modern full-stack applications with Next.js.",
          shortLink: "https://lnkshrt.in/nextjs",
          longUrl: "https://nextjs.org/docs",
     },
     {
          id: 5,
          desc: "Tailwind CSS documentation with utility classes and customization guides.",
          shortLink: "https://lnkshrt.in/tailwind",
          longUrl: "https://tailwindcss.com/docs",
     },
];

export const images = [
     {
          id: 1,
          image: "https://cdn.simpleicons.org/github",
     },
     {
          id: 2,
          image: "https://cdn.simpleicons.org/react",
     },
     {
          id: 3,
          image: "https://cdn.simpleicons.org/nextdotjs",
     },
     {
          id: 4,
          image: "https://cdn.simpleicons.org/vercel",
     },
     {
          id: 5,
          image: "https://cdn.simpleicons.org/tailwindcss",
     },
     {
          id: 6,
          image: "https://cdn.simpleicons.org/typescript",
     },
     {
          id: 7,
          image: "https://cdn.simpleicons.org/javascript",
     },
     {
          id: 8,
          image: "https://cdn.simpleicons.org/node.js",
     },
     {
          id: 9,
          image: "https://cdn.simpleicons.org/postgresql",
     },
     {
          id: 10,
          image: "https://cdn.simpleicons.org/docker",
     },
];

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
                              All Links
                         </h4>
                         <L
                              href="/links/create"
                              className="bg-[#c41e3a] text-white font-medium py-1.5 px-2 rounded"
                         >
                              Create link
                         </L>
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
