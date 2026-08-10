import React from "react";

import { MdKeyboardArrowUp, MdOutlineKeyboardArrowDown, MdRemove } from "react-icons/md";
import { KpiData } from "@/types";

interface KpiCardsProps {
     data: KpiData[];
}

export default function KpiCards({data}:KpiCardsProps) {
     return (
          <div className="grid grid-cols-2  lg:grid-cols-4 gap-3 md:gap-7">
               {data.map((data) => (
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
                                   ) : data.trend === "down" ? (
                                        <span className="flex text-red-600 font-medium text-[12px]">
                                             <MdOutlineKeyboardArrowDown />
                                             <span>{data.change}</span>
                                        </span>
                                   ) : (
                                                  <span className="flex text-gray
                                        -600 font-medium text-[12px]">
                                             <MdRemove />
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
