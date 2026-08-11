"use client";

import React, { useEffect } from "react";

import { FiDownload } from "react-icons/fi";
import { Calendar } from "lucide-react";
import Card from "@/components/ui/Card";
import TopCard from "@/components/ui/TopCard";
import ClickChart from "@/components/ui/ClickChart";
import CitieTable from "@/components/ui/CitieTable";
import { TableData } from "@/components/ui/CitieTable";
import { useState } from "react";
import PiChart from "@/components/ui/PiChart";
import SimpleBarChart from "@/components/ui/BarChart";
import ProgressCard from "@/components/ui/ProgressCard";
// import LocationMap from "@/components/ui/LocationMap";

import api from "@/api/axios";
import { AxiosError } from "axios";

import { OverallAnalyticsResponse } from "@/types";
import { OverallAnalytics } from "@/types";
import { ApiResponse } from "@/types";

import { LinksListSkeleton } from "@/components/Skeleton/LinkSkeleton";
import CardSkeleton from "@/components/Skeleton/CardSkeleton";
import ClicksTrendSkeleton from "@/components/Skeleton/ClicksSkeleton";
import { getCountryColor } from "@/utils/ColorPicker";

export default function Analytics() {
     const [range, setRange] = useState<"7" | "30" | "0">("7");
     // const [details, setDetails] = useState<DetailsProps | null>(null);
     const [analytics, setAnalytics] = useState<OverallAnalytics | null>(null);
     const [err, setErr] = useState<string | null>(null);
     const [loading, setLoading] = useState<boolean>(false);

     useEffect(() => {
          const controller = new AbortController();

          const loadState = async () => {
               setErr("");
               setLoading(true);
               try {
                    const res = await api.get<
                         ApiResponse<OverallAnalyticsResponse>
                    >(`/links/overall-analytcs?range=${range}`, {
                         signal: controller.signal,
                    });

                    setAnalytics(res.data.data.analytcs);
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

          setTimeout(() => {
               loadState();
          }, 1);

          return () => controller.abort();
     }, [range]);

     const topEngagementDay = analytics?.clickTrend?.length
          ? analytics.clickTrend.reduce((max, data) =>
                 data.clicks > max.clicks ? data : max,
            )
          : null;

     const shortUrl = `${process.env.NEXT_PUBLIC_SHORT_URL?.replace(
          /^https?:\/\//,
          "",
     )}${analytics?.topLinks[0]?.shortLink}`;

     const cityTotal =
          analytics?.cities.reduce((sum, city) => sum + city.value, 0) ?? 0;

     const cityTableData: TableData[] =
          analytics?.cities.map((city) => ({
               name: city.name,
               clicks: city.value,
               percentage:
                    cityTotal > 0
                         ? Number(((city.value / cityTotal) * 100).toFixed(1))
                         : 0,
          })) ?? [];

     const osData =
          analytics?.os.map((data) => ({
               ...data,
               fill: getCountryColor(data.name),
          })) ?? [];

     const deviceData =
          analytics?.devices.map((data) => ({
               ...data,
               fill: getCountryColor(data.name),
          })) ?? [];

     const browserData =
          analytics?.browsers.map((data) => ({
               ...data,
               fill: getCountryColor(data.name),
          })) ?? [];

     if (loading) {
          return (
               <div className="flex flex-col  gap-6 px-5 md:px-16 mb-2">
                    <LinksListSkeleton count={1} />
                    <div className="grid grid-cols-2  lg:grid-cols-4 gap-3 md:gap-7">
                         {Array.from({ length: 4 }, (_, i) => (
                              <CardSkeleton key={i} />
                         ))}
                    </div>
                    <ClicksTrendSkeleton />
               </div>
          );
     }

     if (err) {
          return (
               <div className="max-w-100 mx-auto text-2xl text-[#3a24a1] uppercase">
                    {err}
               </div>
          );
     }

     if (!analytics || analytics.totalLinks === 0) {
          return (
               <div className="flex min-h-[400px] items-center justify-center">
                    <div className="text-center">
                         <h2 className="text-lg font-semibold">
                              No analytics yet
                         </h2>
                         <p className="mt-1 text-sm text-muted">
                              Create a link and start getting clicks to see
                              analytics.
                         </p>
                    </div>
               </div>
          );
     }

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
                                             e.target.value as "7" | "30" | "0",
                                        )
                                   }
                              >
                                   <option value="7">Last 7 Days</option>
                                   <option value="30">Last Month</option>
                                   <option value="0">All time</option>
                              </select>
                         </div>
                    </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card
                         name="Total links"
                         data={analytics?.totalLinks ?? 0}
                    />
                    <Card
                         name="Total clicks"
                         data={analytics?.totalClicks ?? 0}
                    />
                    <Card
                         name="Unique visitors"
                         data={analytics?.uniqueVisitors ?? 0}
                    />
                    <Card
                         name="Countries reached"
                         data={analytics?.countriesReached ?? 0}
                    />
                    <Card
                         name="Avg daily  clicks"
                         data={Math.round(analytics?.avgDailyClicks) ?? 0}
                    />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TopCard
                         label="Top day by engagements"
                         name={topEngagementDay?.name}
                         data={topEngagementDay?.clicks}
                    />
                    <TopCard
                         label="Top link by engagements"
                         name={shortUrl}
                         data={analytics?.topLinks[0].clicks}
                    />
                    <TopCard
                         label="Top location by engagements"
                         name={analytics?.cities[0].name}
                         data={analytics?.cities[0].value}
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
                         <ClickChart data={analytics?.clickTrend ?? []} />
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
                              {/* <div className="text-muted text-xs flex gap-2 items-center font-medium">
                                   <span>clicks</span>
                                   <span>
                                        {overallAnalytics?.referrers?.reduce(
                                             (sum, a) => sum + a.clicks,
                                             0,
                                        )}
                                   </span>
                              </div> */}
                         </div>

                         <div className="py-5">
                              {analytics?.referrers ? (
                                   <SimpleBarChart
                                        data={analytics?.referrers}
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
                              {/* <div className="text-muted text-xs flex gap-2 items-center font-medium">
                                   <span>clicks</span>
                                   <span>{totalDevice}</span>
                              </div> */}
                         </div>
                         <div className="flex items-center justify-between  px-1">
                              <div className="w-40">
                                   {analytics?.devices ? (
                                        <PiChart data={deviceData} />
                                   ) : (
                                        <div>No data yet</div>
                                   )}
                              </div>

                              <div className="flex flex-col gap-2">
                                   {deviceData?.map((err) => (
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
                                   {deviceData?.map((c) => (
                                        <h6 key={c.name}>
                                             {Math.floor(
                                                  (c.value /
                                                       analytics.totalClicks) *
                                                       100,
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
                              {/* <div className="text-muted text-xs flex gap-2 items-center font-medium">
                                   <span>clicks</span>
                                   <span>{totalOs}</span>
                              </div> */}
                         </div>
                         <div className="flex items-center justify-between  px-1">
                              <div className="w-40">
                                   {osData ? (
                                        <PiChart data={osData} />
                                   ) : (
                                        <div>No data yet</div>
                                   )}
                              </div>

                              <div className="flex flex-col gap-2">
                                   {osData?.map((err) => (
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
                                   {osData?.map((c) => (
                                        <h6 key={c.name}>
                                             {Math.floor(
                                                  (c.value /
                                                       analytics?.totalClicks) *
                                                       100,
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
                              {/* <div className="text-muted text-xs flex gap-2 items-center font-medium">
                                   <span>clicks</span>
                                   <span>{totalBrowsers}</span>
                              </div> */}
                         </div>
                         <div className="flex items-center justify-between  px-1">
                              <div className="w-40">
                                   {browserData ? (
                                        <PiChart data={browserData} />
                                   ) : (
                                        <div>No data yet</div>
                                   )}
                              </div>

                              <div className="flex flex-col gap-2">
                                   {browserData.map((err) => (
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
                                   {browserData.map((c) => (
                                        <h6 key={c.name}>
                                             {Math.floor(
                                                  (c.value /
                                                       analytics?.totalClicks) *
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
                              {analytics?.countriesData ? (
                                   <ProgressCard
                                        data={analytics.countriesData}
                                        length={Math.max(
                                             analytics.countriesData.reduce(
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

                    {/* <div className="bg-dashBg p-5 rounded-xl">
                         <h2 className="text-muted mb-4">Click locations</h2>

                         <LocationMap />
                    </div> */}
               </div>
          </div>
     );
}
