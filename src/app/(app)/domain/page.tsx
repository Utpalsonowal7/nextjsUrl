"use client";

import React, { useEffect, useState } from "react";
import { IoIosSearch, IoMdAdd } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";
import { AxiosError } from "axios";

import api from "@/api/axios";
import { LinksListSkeleton } from "@/components/Skeleton/LinkSkeleton";
import AddDomainModal from "@/components/models/DomainModel";
import VerifyDomainModal from "@/components/models/VerifyDomainModel";

type Domain = {
     id: number;
     domain: string;
     isVerified: boolean;
     verifiedAt: string | null;
     createdAt: string;
     updatedAt?: string;

     dns?: {
          verification: {
               type: string;
               name: string;
               value: string;
          };
          routing: {
               type: string;
               name: string;
               value: string;
          };
     };
};

function Domains() {
     const [open, setOpen] = useState(false);
     const [verifyOpen, setVerifyOpen] = useState(false);

     const [loading, setLoading] = useState(false);
     const [adding, setAdding] = useState(false);

     const [search, setSearch] = useState("");
     const [err, setErr] = useState("");

     const [domains, setDomains] = useState<Domain[]>([]);
     const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);

     const getDomains = async () => {
          try {
               setLoading(true);
               setErr("");

               const res = await api.get("/domain");

               console.log("Domains:", res.data.data);

               setDomains(res.data.data.domains);
          } catch (error) {
               const e = error as AxiosError<{ message?: string }>;

               setErr(e.response?.data?.message || "Failed to load domains");
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          getDomains();
     }, []);

     console.log(domains)
     const handleAddDomain = async (domain: string) => {
          try {
               setAdding(true);
               setErr("");

               const res = await api.post("/domain", {
                    domain,
               });

               console.log("Domain created:", res.data);

               const newDomain = res.data.data;
               console.log(newDomain)
               /*
                * Add newly created domain to the list
                */
               setDomains((prev) => [newDomain, ...prev]);

               /*
                * Save newly created domain
                * so we can show DNS instructions
                */
               setSelectedDomain(newDomain);

               setOpen(false);

               /*
                * Open DNS verification modal
                */
               setVerifyOpen(true);
          } catch (error) {
               const e = error as AxiosError<{ message?: string }>;

               setErr(e.response?.data?.message || "Failed to add domain");
          } finally {
               setAdding(false);
          }
     };

     /*
      * Open verification modal
      */
     const handleVerifyClick = (domain: Domain) => {
          setSelectedDomain(domain);
          setVerifyOpen(true);
     };

     /*
      * Verify domain
      */
     const handleVerifyDomain = async () => {
          if (!selectedDomain) return;

          try {
               setErr("");

               /*
                * Your verify endpoint
                * Change this if your route is different.
                */
               const res = await api.post(
                    `/domains/${selectedDomain.id}/verify`,
               );

               console.log("Domain verified:", res.data);

               /*
                * Update domain in UI
                */
               setDomains((prev) =>
                    prev.map((domain) =>
                         domain.id === selectedDomain.id
                              ? {
                                     ...domain,
                                     isVerified: true,
                                     verifiedAt: new Date().toISOString(),
                                }
                              : domain,
                    ),
               );

               setSelectedDomain((prev) =>
                    prev
                         ? {
                                ...prev,
                                isVerified: true,
                                verifiedAt: new Date().toISOString(),
                           }
                         : null,
               );

               setVerifyOpen(false);
          } catch (error) {
               const e = error as AxiosError<{ message?: string }>;

               setErr(e.response?.data?.message || "DNS verification failed");
          }
     };

     const filteredDomains = domains?.filter((domain) =>
          domain.domain.toLowerCase().includes(search.toLowerCase()),
     );

     console.log(selectedDomain)
     return (
          <>
               <div className="mb-3 flex flex-col gap-6 px-3 md:px-16">
                    {/* Error */}
                    {err && (
                         <div className="rounded border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                              {err}
                         </div>
                    )}

                    {/* Header */}
                    <div className="flex flex-col gap-5 border-b border-navB py-6">
                         <div className="flex items-center justify-between gap-4">
                              <h4 className="text-2xl font-bold dash-dashText">
                                   Domains
                              </h4>

                              <button
                                   type="button"
                                   disabled={adding}
                                   onClick={() => setOpen(true)}
                                   className="flex cursor-pointer items-center gap-2 rounded bg-[#c41e3a] px-3 py-1.5 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                   <IoMdAdd size={25} />

                                   {adding ? "Adding..." : "Add a domain"}
                              </button>
                         </div>

                         <p className="text-muted">
                              Manage your custom domains for branded short
                              links.
                         </p>

                         {/* Search */}
                         <div className="grid grid-cols-1 md:grid-cols-2">
                              <div className="bg-dashBg">
                                   <form
                                        onSubmit={(e) => e.preventDefault()}
                                        className="flex items-center gap-1 rounded border border-navB px-3 py-3 font-medium text-muted shadow-xs focus-within:ring-2 focus-within:ring-[#f59180]/30"
                                   >
                                        <IoIosSearch />

                                        <input
                                             type="text"
                                             value={search}
                                             onChange={(e) =>
                                                  setSearch(e.target.value)
                                             }
                                             placeholder="Search domains"
                                             className="w-full text-sm outline-none"
                                        />

                                        {search && (
                                             <FaXmark
                                                  className="cursor-pointer"
                                                  onClick={() => setSearch("")}
                                             />
                                        )}
                                   </form>
                              </div>
                         </div>
                    </div>

                    {/* Domain List */}
                    {loading ? (
                         <LinksListSkeleton count={4} />
                    ) : filteredDomains.length > 0 ? (
                         <div className="flex flex-col gap-4">
                              {filteredDomains.map((domain) => (
                                   <div
                                        key={domain.id}
                                        className="flex items-center justify-between gap-4 rounded-lg border border-navB bg-dashBg p-4 transition hover:border-[#f59180]/50 md:p-5"
                                   >
                                        {/* Domain */}
                                        <div className="flex min-w-0 items-center gap-4">
                                             <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-navB bg-background">
                                                  <span className="text-xl">
                                                       🌐
                                                  </span>
                                             </div>

                                             <div className="min-w-0">
                                                  <div className="flex flex-wrap items-center gap-2">
                                                       <h3 className="truncate text-base font-semibold md:text-lg">
                                                            {domain.domain}
                                                       </h3>

                                                       {domain.isVerified ? (
                                                            <span className="rounded-full border border-green-500/20 bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600">
                                                                 Verified
                                                            </span>
                                                       ) : (
                                                            <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-600">
                                                                 Unverified
                                                            </span>
                                                       )}
                                                  </div>

                                                  <p className="mt-1 text-xs text-muted">
                                                       Added{" "}
                                                       {new Date(
                                                            domain.createdAt,
                                                       ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                 month: "short",
                                                                 day: "numeric",
                                                                 year: "numeric",
                                                            },
                                                       )}
                                                  </p>
                                             </div>
                                        </div>

                                        {/* Action */}
                                        <div className="shrink-0">
                                             {domain.isVerified ? (
                                                  <button
                                                       type="button"
                                                       className="rounded border border-navB px-3 py-2 text-sm font-medium transition hover:bg-navB"
                                                  >
                                                       Manage
                                                  </button>
                                             ) : (
                                                  <button
                                                       type="button"
                                                       onClick={() =>
                                                            handleVerifyClick(
                                                                 domain,
                                                            )
                                                       }
                                                       className="rounded bg-[#c41e3a] px-3 py-2 text-sm font-medium text-white transition hover:opacity-90 cursor-pointer"
                                                  >
                                                       Verify
                                                  </button>
                                             )}
                                        </div>
                                   </div>
                              ))}
                         </div>
                    ) : (
                         /* Empty state */
                         <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-navB text-center">
                              <div className="text-4xl">🌐</div>

                              <h3 className="mt-4 text-lg font-semibold dash-dashText">
                                   No domains found
                              </h3>

                              <p className="mt-1 text-sm text-muted">
                                   Add a custom domain to create branded short
                                   links.
                              </p>

                              {!search && (
                                   <button
                                        type="button"
                                        onClick={() => setOpen(true)}
                                        className="mt-4 rounded bg-[#c41e3a] px-4 py-2 text-sm font-medium text-white"
                                   >
                                        Add a domain
                                   </button>
                              )}
                         </div>
                    )}
               </div>

            
               <AddDomainModal
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    onAdd={handleAddDomain}
               />

               {selectedDomain && (
                    <VerifyDomainModal
                         isOpen={verifyOpen}
                         onClose={() => setVerifyOpen(false)}
                         domain={selectedDomain}
                         onVerify={handleVerifyDomain}
                    />
               )}
          </>
     );
}

export default Domains;
