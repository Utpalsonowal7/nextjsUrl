"use client";

import React from "react";

import { FiDownload } from "react-icons/fi";
import { Calendar } from "lucide-react";
import { overallAnalytics } from "@/data/dummyData";
import Card from "@/components/ui/Card";
import TopCard from "@/components/ui/TopCard";
import ClickChart from "@/components/ui/ClickChart";
import CitieTable from "@/components/ui/CitieTable";
import { TableData } from "@/components/ui/CitieTable";
import { useState } from "react";
import PiChart from "@/components/ui/PiChart";
import SimpleBarChart from "@/components/ui/BarChart";
import ProgressCard from "@/components/ui/ProgressCard";
import LocationMap from "@/components/ui/LocationMap";

export const cityTableData: TableData[] = [
     {
          name: "Delhi",
          clicks: 18234,
          percentage: 21.8,
          diff: 8.4,
          status: "up",
     },
     {
          name: "Mumbai",
          clicks: 15982,
          percentage: 19.1,
          diff: 3.2,
          status: "up",
     },
     {
          name: "Bengaluru",
          clicks: 12743,
          percentage: 15.2,
          diff: 2.5,
          status: "down",
     },
     {
          name: "Hyderabad",
          clicks: 9831,
          percentage: 11.8,
          diff: 0,
          status: "idle",
     },
     {
          name: "Chennai",
          clicks: 8421,
          percentage: 10.1,
          diff: 4.6,
          status: "up",
     },
     {
          name: "Kolkata",
          clicks: 7198,
          percentage: 8.6,
          diff: 1.8,
          status: "down",
     },
     {
          name: "Pune",
          clicks: 6450,
          percentage: 7.7,
          diff: 5.1,
          status: "up",
     },
     {
          name: "Ahmedabad",
          clicks: 5146,
          percentage: 6.2,
          diff: 2.3,
          status: "up",
     },
     {
          name: "Jaipur",
          clicks: 3980,
          percentage: 4.8,
          diff: 1.1,
          status: "down",
     },
     {
          name: "Guwahati",
          clicks: 2755,
          percentage: 3.3,
          diff: 0,
          status: "idle",
     },
     {
          name: "Guwahati",
          clicks: 2755,
          percentage: 3.3,
          diff: 0,
          status: "idle",
     },
     {
          name: "Guwahati",
          clicks: 2755,
          percentage: 3.3,
          diff: 0,
          status: "idle",
     },
     {
          name: "Guwahati",
          clicks: 2755,
          percentage: 3.3,
          diff: 0,
          status: "idle",
     },
     {
          name: "Guwahati",
          clicks: 2755,
          percentage: 3.3,
          diff: 0,
          status: "idle",
     },
     {
          name: "Guwahati",
          clicks: 2755,
          percentage: 3.3,
          diff: 0,
          status: "idle",
     },
     {
          name: "Guwahati",
          clicks: 2755,
          percentage: 3.3,
          diff: 0,
          status: "idle",
     },
     {
          name: "Guwahati",
          clicks: 2755,
          percentage: 3.3,
          diff: 0,
          status: "idle",
     },
     {
          name: "Guwahati",
          clicks: 2755,
          percentage: 3.3,
          diff: 0,
          status: "idle",
     },
     {
          name: "Guwahati",
          clicks: 2755,
          percentage: 3.3,
          diff: 0,
          status: "idle",
     },
     {
          name: "Guwahati",
          clicks: 2755,
          percentage: 3.3,
          diff: 0,
          status: "idle",
     },
     {
          name: "Guwahati",
          clicks: 2755,
          percentage: 3.3,
          diff: 0,
          status: "idle",
     },
     {
          name: "Guwahati",
          clicks: 2755,
          percentage: 3.3,
          diff: 0,
          status: "idle",
     },
     {
          name: "Guwahati",
          clicks: 2755,
          percentage: 3.3,
          diff: 0,
          status: "idle",
     },
];

export default function Analytics() {
     const [range, setRange] = useState<"7" | "14" | "30" | "0">("7");

     const totalDevice =
          overallAnalytics?.devices?.reduce((sum, ac) => sum + ac.value, 0) ??
          0;
     const totalOs =
          overallAnalytics?.os?.reduce((sum, ac) => sum + ac.value, 0) ?? 0;
     const totalBrowsers =
          overallAnalytics?.browsers?.reduce((sum, ac) => sum + ac.value, 0) ?? 0;

     return (
          <div className="flex flex-col  gap-6 px-3 md:px-16 mb-3">
               <div className="flex flex-col gap-7 py-3 md:py-6 border-b border-navB">
                    <div className="flex items-center justify-between">
                         <h4 className="font-bold text-2xl dash-dashText">
                              Analytics
                         </h4>
                         <button className="bg-[#c41e3a] text-white font-medium py-2 px-2.5 rounded flex gap-1">
                              <FiDownload className="font-bold w-4 h-5" />
                              <span>Download Excel</span>
                         </button>
                    </div>
                    <div className="w-[50%] md:w-[20%] border py-2.5 px-2 md:px-4 bg-dashBg border-navB rounded shadow-xs">
                         <div className="flex items-center gap-2 cursor-pointer">
                              <span>
                                   <Calendar className="w-5 h-5 text-muted/50" />
                              </span>
                              <select
                                   value={range}
                                   name="date"
                                   className="text-muted/50 text-[15px] font-medium flex gap-6 pr-4 md:pr-10 outline-none cursor-pointer"
                                   onChange={(
                                        e: React.ChangeEvent<HTMLSelectElement>,
                                   ) =>
                                        setRange(
                                             e.target.value as
                                                  | "7"
                                                  | "14"
                                                  | "30"
                                                  | "0",
                                        )
                                   }
                              >
                                   <option value="7">Last 7 Days</option>
                                   <option value="14">Last 14 Days</option>
                                   <option value="30">Last Month</option>
                                   <option value="0">All time</option>
                              </select>
                         </div>
                    </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card
                         name="Total links"
                         data={overallAnalytics?.totalLinks}
                    />
                    <Card
                         name="Total clicks"
                         data={overallAnalytics?.totalClicks}
                    />
                    <Card
                         name="Unique visitors"
                         data={overallAnalytics?.uniqueVisitors}
                    />
                    <Card
                         name="Countries reached"
                         data={overallAnalytics?.countriesReached}
                    />
                    <Card
                         name="Avg daily  clicks"
                         data={overallAnalytics?.avgDailyClicks}
                    />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TopCard
                         label={
                              overallAnalytics?.highlights?.topEngagementDay
                                   ?.label
                         }
                         name={
                              overallAnalytics?.highlights?.topEngagementDay
                                   ?.name
                         }
                         data={
                              overallAnalytics?.highlights?.topEngagementDay
                                   ?.clicks
                         }
                    />
                    <TopCard
                         label={overallAnalytics?.highlights?.topLink?.label}
                         name={overallAnalytics?.highlights?.topLink?.shortLink}
                         data={overallAnalytics?.highlights?.topLink?.clicks}
                    />
                    <TopCard
                         label="Top location by engagements"
                         name={overallAnalytics?.highlights?.topCity?.name}
                         data={overallAnalytics?.highlights?.topCity?.value}
                    />
               </div>

               <div className="border flex flex-col py-5 md:px-6 bg-dashBg border-navB rounded-xl gap-5">
                    <div className="flex items-center justify-between px-2">
                         <div>
                              <h5 className="font-medium text-muted">
                                   Engagement over time
                              </h5>
                         </div>
                         <div className="outline-none text-xs bg-dashBg text-muted">
                              {range === "0" ? "All time" : `${range} Day`}
                         </div>
                    </div>

                    <div className="[webkit-tap-highlight-color:transparent] px-1 md:px-6">
                         <ClickChart
                              data={overallAnalytics?.clickTrend ?? []}
                         />
                    </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CitieTable
                         heading="Engagements by location"
                         data={cityTableData}
                    />

                    <div className="bg-dashBg flex flex-col px-3 md:px-10 py-5  gap-5 border border-navB rounded-xl">
                         <div className="flex justify-between items-center">
                              <div className="text-muted font-medium">
                                   Referrers
                              </div>
                              <div className="text-muted text-xs flex gap-2 items-center font-medium">
                                   <span>clicks</span>
                                   <span>
                                        {overallAnalytics?.referrers?.reduce(
                                             (sum, a) => sum + a.clicks,
                                             0,
                                        )}
                                   </span>
                              </div>
                         </div>

                         <div className="py-5">
                              {overallAnalytics?.referrers ? (
                                   <SimpleBarChart
                                        data={overallAnalytics?.referrers}
                                        datakey="source"
                                   />
                              ) : (
                                   <div>No Data Yet</div>
                              )}
                         </div>
                    </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-dashBg flex flex-col px-3 md:px-10 py-5  gap-5 border border-navB rounded-xl">
                         <div className="flex justify-between items-center">
                              <div className="text-muted font-medium">
                                   Devices
                              </div>
                              <div className="text-muted text-xs flex gap-2 items-center font-medium">
                                   <span>clicks</span>
                                   <span>{totalDevice}</span>
                              </div>
                         </div>
                         <div className="flex items-center justify-between  px-1">
                              <div className="w-40">
                                   {overallAnalytics?.devices ? (
                                        <PiChart
                                             data={overallAnalytics?.devices}
                                        />
                                   ) : (
                                        <div>No data yet</div>
                                   )}
                              </div>

                              <div className="flex flex-col gap-2">
                                   {overallAnalytics?.devices?.map((err) => (
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
                                   {overallAnalytics?.devices?.map((c) => (
                                        <h6 key={c.name}>
                                             {Math.floor(
                                                  (c.value / totalDevice) * 100,
                                             )}
                                             %
                                        </h6>
                                   ))}
                              </div>
                         </div>
                    </div>
                    <div className="bg-dashBg flex flex-col px-3 md:px-10 py-5  gap-5 border border-navB rounded-xl">
                         <div className="flex justify-between items-center">
                              <div className="text-muted font-medium">OS</div>
                              <div className="text-muted text-xs flex gap-2 items-center font-medium">
                                   <span>clicks</span>
                                   <span>{totalOs}</span>
                              </div>
                         </div>
                         <div className="flex items-center justify-between  px-1">
                              <div className="w-40">
                                   {overallAnalytics?.os ? (
                                        <PiChart data={overallAnalytics?.os} />
                                   ) : (
                                        <div>No data yet</div>
                                   )}
                              </div>

                              <div className="flex flex-col gap-2">
                                   {overallAnalytics?.os?.map((err) => (
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
                                   {overallAnalytics?.os?.map((c) => (
                                        <h6 key={c.name}>
                                             {Math.floor(
                                                  (c.value / totalOs) * 100,
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
                                   <span>{totalBrowsers}</span>
                              </div>
                         </div>
                         <div className="flex items-center justify-between  px-1">
                              <div className="w-40">
                                   {overallAnalytics?.browsers ? (
                                        <PiChart
                                             data={overallAnalytics?.browsers}
                                        />
                                   ) : (
                                        <div>No data yet</div>
                                   )}
                              </div>

                              <div className="flex flex-col gap-2">
                                   {overallAnalytics?.browsers?.map((err) => (
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
                                   {overallAnalytics?.devices?.map((c) => (
                                        <h6 key={c.name}>
                                             {Math.floor(
                                                  (c.value / totalBrowsers) *
                                                       100,
                                             )}
                                             %
                                        </h6>
                                   ))}
                              </div>
                         </div>
                    </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4">
                    <div className="bg-dashBg px-3 md:px-5 py-5 rounded-xl border border-navB flex flex-col gap-5">
                         <div className="text-muted font-medium">OS</div>

                         <div className="w-full">
                              {overallAnalytics?.countriesData ? (
                                   <ProgressCard
                                        data={overallAnalytics.countriesData}
                                        length={Math.max(
                                             overallAnalytics.countriesData.reduce(
                                                  (max, a) =>
                                                       max > a.value
                                                            ? max
                                                            : a.value,
                                                  0,
                                             ),
                                        )}
                                   />
                              ) : (
                                   <div>No Data Yet</div>
                              )}
                         </div>
                    </div>

                    <div className="bg-dashBg p-5 rounded-xl">
                         <h2 className="text-muted mb-4">Click locations</h2>

                         <LocationMap />
                    </div>
               </div>
          </div>
     );
}
