"use client";

import { MdLock, MdContentCopy } from "react-icons/md";
import { IoIosCheckmarkCircle } from "react-icons/io";
import KpiCards from "@/components/ui/KpiCards";
import ClickChart from "@/components/ui/ClickChart";
import { last12Hours } from "@/data/dummyData";
import { last6Hours } from "@/data/dummyData";
import { last24Hours } from "@/data/dummyData";
import { useState } from "react";
import PiChart from "@/components/ui/PiChart";
import Image from "next/image";
import { cities } from "@/data/cities";
import ProgressCard from "@/components/ui/ProgressCard";

const data = {
     "6h": last6Hours,
     "12h": last12Hours,
     "24h": last24Hours,
};

export const topLinks = [
     {
          id: 1,
          logo: "https://cdn.simpleicons.org/github",
          title: "GitHub",
          longUrl: "https://github.com/utpalsonowal/lnkshrt",
          shortUrl: "lnkshrt.in/github",
          clicks: 1248,
     },
     {
          id: 2,
          logo: "https://cdn.simpleicons.org/vercel",
          title: "Vercel",
          longUrl: "https://vercel.com/dashboard",
          shortUrl: "lnkshrt.in/vercel",
          clicks: 987,
     },
     {
          id: 3,
          logo: "https://cdn.simpleicons.org/react",
          title: "React",
          longUrl: "https://react.dev/learn",
          shortUrl: "lnkshrt.in/react",
          clicks: 763,
     },
     {
          id: 4,
          logo: "https://cdn.simpleicons.org/nextdotjs",
          title: "Next.js",
          longUrl: "https://nextjs.org/docs",
          shortUrl: "lnkshrt.in/next",
          clicks: 541,
     },
     {
          id: 5,
          logo: "https://cdn.simpleicons.org/tailwindcss",
          title: "Tailwind CSS",
          longUrl: "https://tailwindcss.com/docs",
          shortUrl: "lnkshrt.in/tailwind",
          clicks: 386,
     },
];

export const piData = [
     { name: "India", value: 482, fill: "#ec4899" },
     { name: "United States", value: 361, fill: "#06b6d4" },
     { name: "United Kingdom", value: 247, fill: "#84cc16" },
     { name: "Germany", value: 184, fill: "#f97316" },
     { name: "Japan", value: 126, fill: "#6366f1" },
];


function Home() {
     const [range, setRange] = useState<"6h" | "12h" | "24h">("24h");
     const [copied, setIsCopied] = useState < number | null>(null);

     

     const handleCopy = async (id:number, url:string) => {
        
               await navigator.clipboard.writeText(
                    url
               );
          setIsCopied(id)

          setTimeout(()=>{setIsCopied(null)},2000)
     };

     const fullLength = piData.reduce((c, err) => c + err.value, 0);
     const cityLength = Math.max(...cities.map((max) => max.value));
     console.log(cityLength);
     return (
          <div className="flex flex-col  gap-6 px-5 md:px-16">
               <div className="hidden w-full  border border-navB py-8 px-6 bg-dashBg rounded md:flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                         <h1 className="text-xl font-medium text-dashText tracking-sm ">
                              Quick Create: Short Link
                         </h1>
                         <p className="text-sm text-muted">
                              Paste your URL to generate a short link instantly
                         </p>
                    </div>
                    <div className="flex gap-2 items-center">
                         <span className="font-light ">Domain:</span>
                         <div className="flex items-center gap-0.5">
                              <span className="font-semibold">s.utpx.in</span>
                              <span>
                                   <MdLock className="h-3.5 w-3.5" />
                              </span>
                         </div>
                    </div>

                    <div>
                         <form className="flex flex-col gap-3">
                              <label className="text-dashText font-medium text-sm">
                                   Enter your destination URL
                              </label>
                              <div className="flex flex-col  sm:flex-row gap-6">
                                   <div className="w-full md:w-[70%]">
                                        <input
                                             type="url"
                                             className="w-full border border-navB outline-none px-3 py-2.5 rounded
                                        focus:ring-2
                                        focus:ring-[#f59180]/30 font-sm"
                                             placeholder="https://example.com/long-url"
                                             required
                                        />
                                   </div>
                                   <button className="px-2 py-2.5 font-bold text-sm bg-[#c41e3a] text-white rounded cursor-pointer">
                                        Create your first link
                                   </button>
                              </div>
                         </form>
                    </div>
               </div>

               <div>
                    <KpiCards />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-[750px_1fr] gap-4">
                    <div className="border flex flex-col py-5 px-2 bg-dashBg border-navB rounded-xl gap-5">
                         <div className="flex items-center justify-between px-2">
                              <div>
                                   <h5 className="font-medium text-muted">
                                        Clicks trend of last {range}
                                   </h5>
                              </div>
                              <div>
                                   <select
                                        className="outline-none text-xs bg-dashBg text-muted"
                                        value={range}
                                        onChange={(e) =>
                                             setRange(
                                                  e.target.value as
                                                       | "6h"
                                                       | "12h"
                                                       | "24h",
                                             )
                                        }
                                   >
                                        <option value="6h">last 6 hour</option>
                                        <option value="12h">
                                             last 12 hour
                                        </option>
                                        <option value="24h">
                                             last 24 hour
                                        </option>
                                   </select>
                              </div>
                         </div>
                         <div className="[webkit-tap-highlight-color:transparent]">
                              <ClickChart data={data[range]} />
                         </div>
                    </div>

                    <div className="bg-dashBg flex flex-col px-3 md:px-10 py-5  gap-5 border border-navB rounded-xl">
                         <div className="text-muted font-medium">
                              Top Countries
                         </div>

                         <div className="flex items-center justify-between  px-1">
                              <div className="w-48 ">
                                   <PiChart data={piData} />
                              </div>

                              <div className="flex flex-col gap-2">
                                   {piData.map((err) => (
                                        <p
                                             key={err.name}
                                             className="flex items-center gap-2 text-[10px] text-muted"
                                        >
                                             <span
                                                  className="w-2 h-2 rounded-xs"
                                                  style={{
                                                       backgroundColor:
                                                            err.fill,
                                                  }}
                                             ></span>
                                             {err.name
                                                  .slice(0, 3)
                                                  .toUpperCase()}
                                        </p>
                                   ))}
                              </div>

                              <div className="flex flex-col gap-2 text-xs text-dashText font-bold">
                                   {piData.map((c) => (
                                        <h6 key={c.name}>
                                             {Math.floor(
                                                  (c.value / fullLength) * 100,
                                             )}
                                             %
                                        </h6>
                                   ))}
                              </div>
                         </div>
                    </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start py-1">
                    <div className="bg-dashBg px-3 md:px-5 py-5 rounded-xl border border-navB flex flex-col gap-5">
                         <div className="text-muted font-medium">
                              Today top 5 links
                         </div>

                         <div className="flex flex-col gap-5">
                              {topLinks.map((l) => (
                                   <div
                                        key={l.id}
                                        className="flex flex-row justify-between items-center gap-2 cursor-pointer"
                                   >
                                        <div className="flex items-center gap-4 overflow-hidden min-w-0">
                                             <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-[#fb5a721f] border border-[#fb5a7247] rounded-xl text-[##fb5a72]">
                                                  <Image
                                                       src={l.logo}
                                                       alt={l.title}
                                                       width={20}
                                                       height={20}
                                                       unoptimized
                                                  />
                                             </div>

                                             <div className="min-w-0">
                                                  <h5 className="font-bold text-[13px] text-foreground/80 truncate flex items-center gap-3">
                                                       <span>{l.shortUrl}</span>
                                                       <button
                                                            onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 handleCopy(
                                                                      l.id,
                                                                      l.shortUrl,
                                                                 );
                                                            }}
                                                            className="cursor-pointer"
                                                       >
                                                            {copied === l.id ? (
                                                                 <IoIosCheckmarkCircle />
                                                            ) : (
                                                                 <MdContentCopy />
                                                            )}
                                                       </button>
                                                  </h5>
                                                  <h6 className="text-xs text-muted truncate">
                                                       {l.longUrl}
                                                  </h6>
                                             </div>
                                        </div>
                                        <div className="flex gap-1 bg-dashBg border border-navB text-[10px] py-1.5 px-1.5 rounded-3xl text-muted font-bold shadow-2xl">
                                             <span>{l.clicks}</span>
                                             <span>clicks</span>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    </div>

                    <div className="bg-dashBg px-3 md:px-5 py-5 rounded-xl border border-navB flex flex-col gap-5">
                         <div className="text-muted font-medium">
                              Top Cities
                         </div>

                         {/* <div className="w-full flex flex-col gap-3 ">
                              {cities.map((c) => (
                                   <div
                                        key={c.city}
                                        className="w-full flex items-center justify-between  "
                                   >
                                        <div className="w-[25%] ">
                                             <span className="font-bold text-[13px] text-foreground/80 truncate flex items-center gap-3">
                                                  {c.city}
                                             </span>
                                        </div>
                                        <div className="w-[40%] rounded">
                                             <div
                                                  className=" bg-[#fc5a72] h-2 rounded"
                                                  style={{
                                                       width: `${(c.total / cityLength) * 100}%`,
                                                  }}
                                             ></div>
                                        </div>
                                        <div className="w-[15%] text-center text-muted text-xs">
                                             {c.total}
                                        </div>
                                   </div>
                              ))}
                         </div> */}
                         <div className="w-full">
                              {cities ? (
                                   <ProgressCard
                                        data={cities}
                                        length={cityLength}
                                   />
                              ) : (
                                   <div>No Data Yet</div>
                              )}
                         </div>
                    </div>
               </div>
          </div>
     );
}

export default Home;
