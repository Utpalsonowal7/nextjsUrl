"use client";

import React from "react";
import { useParams } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";
import { BsTags } from "react-icons/bs";
import LinkRoute from "next/link";
import Link from "@/components/ui/Link";
import { links } from "@/data/dummyData";
import { images } from "../page";
import ClickChart from "@/components/ui/ClickChart";
import Card from "@/components/ui/Card";
import PiChart from "@/components/ui/PiChart";
import SimpleBarChart from "@/components/ui/BarChart";
import ProgressCard from "@/components/ui/ProgressCard";

function Page() {
     const { id } = useParams<{ id: string }>();

     const link = links.find((l) => l.id === Number(id));
     const image = images.find((img) => img.id === Number(id));

     const fullLength: number | undefined =
          link?.analytics?.countriesData?.reduce((a, b) => a + b.value, 0);

     const fullLength1: number | undefined = link?.analytics?.browsers?.reduce(
          (a, b) => a + b.value,
          0,
     );

     const fullLength2: number | undefined = link?.analytics?.devices?.reduce(
          (a, b) => a + b.value,
          0,
     );

     if (!link) {
          return <div>link not found</div>;
     }

     return (
          <div className="flex flex-col  gap-6 px-5 md:px-16 mb-2">
               <div className="flex gap-2 items-center cursor-pointer">
                    <LinkRoute
                         href="/links"
                         className="flex gap-2 items-center"
                    >
                         <IoIosArrowRoundBack />
                         Back to list
                    </LinkRoute>
               </div>

               <div>
                    <div className="bg-dashBg rounded-xl py-4 px-8">
                         <div className="">
                              <Link link={link} image={image?.image ?? "vv"} />
                         </div>

                         <div className="px-15">
                              <hr className="border border-navB mb-2" />
                              <div className="flex justify-between items-center">
                                   <div className="flex gap-2 px-3">
                                        {link.tags ? (
                                             link.tags.map((t, key) => (
                                                  <span
                                                       key={key}
                                                       className="text-muted text-xs flex items-center bg-dashBg border border-navB rounded-xl py-0.5 px-2 shadow-2xl"
                                                  >
                                                       {t}
                                                  </span>
                                             ))
                                        ) : (
                                             <span className=" gap-2 text-muted text-xs flex items-center">
                                                  <BsTags />
                                                  No tags
                                             </span>
                                        )}
                                   </div>

                                   <div className="gap-2 text-muted text-xs flex items-center">
                                        {link.createdAt}
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>

               <div className="grid grid-cols-2  lg:grid-cols-4 gap-3 md:gap-7">
                    <Card
                         name="Total clicks"
                         data={link.analytics?.totalClicks ?? 0}
                    />
                    <Card
                         name="Unique visitors"
                         data={link.analytics?.uniqueVisitors ?? 0}
                    />
                    <Card
                         name="Daily avg/clicks"
                         data={link.analytics?.avgDailyClicks ?? 0}
                    />
                    <Card
                         name="Countries"
                         data={link.analytics?.countries ?? 0}
                    />
               </div>

               <div className="border flex flex-col py-5 px-10 bg-dashBg border-navB rounded-xl gap-5">
                    <div className="flex items-center justify-between px-2">
                         <div>
                              <h5 className="font-medium text-muted">
                                   Clicks trend of last week
                              </h5>
                         </div>
                         <div>
                              <select
                                   className="outline-none text-xs bg-dashBg text-muted"
                                   value={7}
                                   // onChange={(e) =>
                                   //      setRange(
                                   //           e.target.value as
                                   //                | "6h"
                                   //                | "12h"
                                   //                | "24h",
                                   //      )
                                   // }
                              >
                                   <option value="6h">last 6 hour</option>
                                   <option value="12h">last 12 hour</option>
                                   <option value="24h">last 24 hour</option>
                              </select>
                         </div>
                    </div>

                    <div className="[webkit-tap-highlight-color:transparent] px-10">
                         <ClickChart data={link.analytics?.clickTrend ?? []} />
                    </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-dashBg flex flex-col px-3 md:px-10 py-5  gap-5 border border-navB rounded-xl">
                         <div className="flex justify-between items-center">
                              <div className="text-muted font-medium">
                                   Countries
                              </div>
                              <div className="text-muted text-xs flex gap-2 items-center font-medium">
                                   <span>clicks</span>
                                   <span>{fullLength}</span>
                              </div>
                         </div>

                         <div className="flex items-center justify-between  px-1">
                              <div className="w-40">
                                   {link?.analytics?.countriesData ? (
                                        <PiChart
                                             data={
                                                  link.analytics?.countriesData
                                             }
                                        />
                                   ) : (
                                        <div>No data yet</div>
                                   )}
                              </div>

                              <div className="flex flex-col gap-2">
                                   {link?.analytics?.countriesData?.map(
                                        (err) => (
                                             <p
                                                  key={err.name}
                                                  className="flex items-center gap-2 text-[10px] text-muted"
                                             >
                                                  <span
                                                       className="w-2 h-2 rounded-xs"
                                                       style={{
                                                            backgroundColor:
                                                                 err?.fill ??
                                                                 "#e31d48",
                                                       }}
                                                  ></span>
                                                  {err.name
                                                       .slice(0, 3)
                                                       .toUpperCase()}
                                             </p>
                                        ),
                                   )}
                              </div>
                              <div className="flex flex-col gap-2 text-xs text-dashText font-bold">
                                   {link?.analytics?.countriesData?.map((c) => (
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
                    <div className="bg-dashBg flex flex-col px-3 md:px-10 py-5  gap-5 border border-navB rounded-xl">
                         <div className="flex justify-between items-center">
                              <div className="text-muted font-medium">
                                   Devices
                              </div>
                              <div className="text-muted text-xs flex gap-2 items-center font-medium">
                                   <span>clicks</span>
                                   <span>{fullLength2}</span>
                              </div>
                         </div>
                         <div className="flex items-center justify-between  px-1">
                              <div className="w-40">
                                   {link?.analytics?.devices ? (
                                        <PiChart
                                             data={link.analytics?.devices}
                                        />
                                   ) : (
                                        <div>No data yet</div>
                                   )}
                              </div>

                              <div className="flex flex-col gap-2">
                                   {link?.analytics?.devices?.map((err) => (
                                        <p
                                             key={err.name}
                                             className="flex items-center gap-2 text-[10px] text-muted"
                                        >
                                             <span
                                                  className="w-2 h-2 rounded-xs"
                                                  style={{
                                                       backgroundColor:
                                                            err?.fill ??
                                                            "#e31d48",
                                                  }}
                                             ></span>
                                             {err.name
                                                  .slice(0, 3)
                                                  .toUpperCase()}
                                        </p>
                                   ))}
                              </div>
                              <div className="flex flex-col gap-2 text-xs text-dashText font-bold">
                                   {link?.analytics?.devices?.map((c) => (
                                        <h6 key={c.name}>
                                             {Math.floor(
                                                  (c.value / fullLength2) * 100,
                                             )}
                                             %
                                        </h6>
                                   ))}
                              </div>
                         </div>
                    </div>

                    <div className="bg-dashBg flex flex-col px-3 md:px-10 py-5  gap-5 border border-navB rounded-xl">
                         <div className="flex justify-between items-center">
                              <div className="text-muted font-medium">
                                   Browsers
                              </div>
                              <div className="text-muted text-xs flex gap-2 items-center font-medium">
                                   <span>clicks</span>
                                   <span>
                                        {link?.analytics?.browsers?.reduce(
                                             (sum, ac) => sum + ac.value,
                                             0,
                                        )}
                                   </span>
                              </div>
                         </div>
                         <div className="flex items-center justify-between  px-1">
                              <div className="w-40">
                                   {link?.analytics?.browsers ? (
                                        <PiChart
                                             data={link.analytics.browsers}
                                        />
                                   ) : (
                                        <div>No data yet</div>
                                   )}
                              </div>

                              <div className="flex flex-col gap-2">
                                   {link?.analytics?.browsers?.map((err) => (
                                        <p
                                             key={err.name}
                                             className="flex items-center gap-2 text-[10px] text-muted"
                                        >
                                             <span
                                                  className="w-2 h-2 rounded-xs"
                                                  style={{
                                                       backgroundColor:
                                                            err?.fill ??
                                                            "#e31d48",
                                                  }}
                                             ></span>
                                             {err.name
                                                  .slice(0, 3)
                                                  .toUpperCase()}
                                        </p>
                                   ))}
                              </div>
                              <div className="flex flex-col gap-2 text-xs text-dashText font-bold">
                                   {link?.analytics?.browsers?.map((c) => (
                                        <h6 key={c.name}>
                                             {Math.floor(
                                                  (c.value / fullLength1) * 100,
                                             )}
                                             %
                                        </h6>
                                   ))}
                              </div>
                         </div>
                    </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <div className="bg-dashBg flex flex-col px-3 md:px-10 py-5  gap-5 border border-navB rounded-xl">
                         <div className="flex justify-between items-center">
                              <div className="text-muted font-medium">
                                   Referrers
                              </div>
                              <div className="text-muted text-xs flex gap-2 items-center font-medium">
                                   <span>clicks</span>
                                   <span>
                                        {link?.analytics?.referrers?.reduce(
                                             (sum, a) => sum + a.clicks,
                                             0,
                                        )}
                                   </span>
                              </div>
                         </div>

                         <div className="py-5">
                              {link?.analytics?.referrers ? (
                                   <SimpleBarChart
                                        data={link.analytics?.referrers}
                                        datakey="source"
                                   />
                              ) : (
                                   <div>No Data Yet</div>
                              )}
                         </div>
                    </div>
                    <div className="bg-dashBg px-3 md:px-5 py-5 rounded-xl border border-navB flex flex-col gap-5">
                         <div className="text-muted font-medium">
                               Cities
                         </div>

                         <div className="w-full">
                              {link.analytics?.cities ? (
                                   <ProgressCard
                                        data={link.analytics.cities}
                                        length={Math.max(link.analytics.cities.reduce((max, a)=> max > a.value ? max : a.value,0))}
                                   />
                              ) : (
                                   <div>No Data Yet</div>
                              )}
                         </div>
                    </div>
                    <div className="bg-dashBg px-3 md:px-5 py-5 rounded-xl border border-navB flex flex-col gap-5">
                         <div className="text-muted font-medium">
                              OS
                         </div>

                         <div className="w-full">
                              {link?.analytics?.os ? (
                                   <ProgressCard
                                        data={link.analytics.os}
                                        length={Math.max(link.analytics.os.reduce((max, a)=> max > a.value ? max : a.value,0))}
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

export default Page;
