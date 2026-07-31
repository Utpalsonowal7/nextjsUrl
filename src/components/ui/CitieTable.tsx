import React from "react";

import { MdKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";

export interface TableData {
     name: string;
     clicks: number;
     percentage: number;
     diff: number;
     status: "idle" | "up" | "down";
}

interface PropsData {
     heading: string;
     data: TableData[];
}

function CitieTable({ heading, data }: PropsData) {
     const length = data.length;

     return (
          <div className="flex flex-col gap-6 bg-dashBg border border-navB py-4 px-2 md:px-7 rounded-xl">
               <div className="text-muted font-medium text-sm">{heading}</div>
               <div>
                    <table className="w-full border-separate border-spacing-y-3 ">
                         <thead>
                              <tr className="text-xs text-muted uppercase">
                                   <th className="text-left font-medium">
                                        Cities
                                   </th>
                                   <th className="text-right font-medium">
                                        Clicks
                                   </th>
                                   <th className="text-right font-medium">%</th>
                                   <th className="text-right font-medium">
                                        vs prev.
                                   </th>
                              </tr>
                         </thead>

                         <tbody>
                              {data.map((d) => (
                                   <tr
                                        key={d.name}
                                        className="hover:bg-white/5 transition-colors rounded-lg text-sm"
                                   >
                                        <td className="py-1 font-medium text-dashText">
                                             {d.name}
                                        </td>

                                        <td className="py-1 text-right">
                                             {d.clicks.toLocaleString()}
                                        </td>

                                        <td className="py-1 text-right">
                                             {d.percentage}%
                                        </td>

                                        <td className="py-1 text-right">
                                             {d.status === "idle" ? (
                                                  <span className="text-muted">
                                                       —
                                                  </span>
                                             ) : d.status === "up" ? (
                                                  <span className="inline-flex items-center justify-end gap-1 text-green-500 font-medium">
                                                       <MdKeyboardArrowUp className="text-lg" />
                                                       {d.diff}%
                                                  </span>
                                             ) : (
                                                  <span className="inline-flex items-center justify-end gap-1 text-red-500 font-medium">
                                                       <MdOutlineKeyboardArrowDown className="text-lg" />
                                                       {d.diff}%
                                                  </span>
                                             )}
                                        </td>
                                   </tr>
                              ))}
                         </tbody>
                    </table>
               </div>
          </div>
     );
}

export default CitieTable;
