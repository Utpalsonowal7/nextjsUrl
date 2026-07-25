import React from "react";

import { MdKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";

const kpiData = [
     {
          id: 1,
          title: "Today's Clicks",
          value: "842",
          change: "+12.3%",
          trend: "up",
          period: "vs yesterday",
     },
     {
          id: 2,
          title: "Links Created",
          value: "27",
          change: "+8.5%",
          trend: "up",
          period: "vs yesterday",
     },
     {
          id: 3,
          title: "Unique Visitors",
          value: "691",
          change: "+5.2%",
          trend: "up",
          period: "vs yesterday",
     },
     {
          id: 4,
          title: "QR Code Scans",
          value: "118",
          change: "-2.1%",
          trend: "down",
          period: "vs yesterday",
     },
];

export default function KpiCards() {
     return (
          <div className="grid grid-cols-2  lg:grid-cols-4 gap-3 md:gap-7">
               {kpiData.map((data) => (
                    <div
                         key={data.id}
                         className="flex flex-col gap-3 bg-dashBg border border-navB py-4 px-2 md:px-7 rounded-xl"
                    >
                         <div>
                              <h4 className="text-muted font-medium text-sm">
                                   {data.title}
                              </h4>
                         </div>
                         <div className="font-bold">{data.value}</div>
                         <div className="flex gap-1">
                              <span className="flex">
                                   {data.trend === "up" ? (
                                        <span className="flex text-green-400 font-medium text-[12px]">
                                             <MdKeyboardArrowUp />
                                             <span>{data.change}</span>
                                        </span>
                                   ) : (
                                        <span className="flex text-red-600 font-medium text-[12px]">
                                             <MdOutlineKeyboardArrowDown />
                                             <span>{data.change}</span>
                                        </span>
                                   )}
                              </span>

                              <span className="text-muted text-xs">
                                   {data.period}
                              </span>
                         </div>
                    </div>
               ))}
          </div>
     );
}
