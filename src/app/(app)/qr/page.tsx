"use client";

import L from "next/link";
import { IoIosSearch } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";

import { useState, useEffect } from "react";
import { LinksListSkeleton } from "@/components/Skeleton/LinkSkeleton";
import Qr from "@/components/ui/Qr";

import { userQrs, ApiResponse } from "@/types";
import api from "@/api/axios";
import { AxiosError } from "axios";

function Page() {
     const [search, setSearch] = useState<string | null>(null);
     const [loading, setLoading] = useState<boolean>(false);
     const [qr, setQr] = useState<userQrs[]>([]);

     useEffect(() => {
          const controller = new AbortController();

          const loadState = async () => {
               // setErr("");
               setLoading(true);

               try {
                    const res = await api.get<
                         ApiResponse<{ qr: { qr: userQrs[] } }>
                    >("/links/user-qrs", {
                         signal: controller.signal,
                    });
                    console.log(res.data);
                    const qr = res.data.data.qr.qr;

                    setQr(qr);
               } catch (err) {
                    const e = err as AxiosError<{ message?: string }>;

                    if (
                         e.code === "ERR_CANCELED" ||
                         e.name === "CanceledError"
                    ) {
                         return;
                    }

                    // setErr(e.response?.data?.message || "Failed to load links");
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
     }, []);

     return (
          <div className="flex flex-col  gap-6 px-3 md:px-16 mb-3">
               <div className="flex flex-col gap-5 py-6 border-b border-navB">
                    <div className="flex items-center justify-between">
                         <h4 className="font-bold text-2xl dash-dashText">
                              All Links
                         </h4>
                         <L
                              href="/qr/create"
                              className="bg-[#c41e3a] text-white font-medium py-1.5 px-2 rounded"
                         >
                              Create Code
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
                         {qr.map((l) => {
                              return <Qr key={l.id} data={l} />;
                         })}
                    </div>
               )}
          </div>
     );
}

export default Page;
