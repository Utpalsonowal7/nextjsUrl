import React, { useState } from "react";
import {
     MdKeyboardArrowUp,
     MdOutlineKeyboardArrowDown,
     MdKeyboardArrowLeft,
     MdKeyboardArrowRight,
} from "react-icons/md";

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

const ROWS_PER_PAGE = 6;

function CitieTable({ heading, data }: PropsData) {
     const [page, setPage] = useState(0);

     const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
     console.log(totalPages);
     const currentData = data.slice(
          page * ROWS_PER_PAGE,
          (page + 1) * ROWS_PER_PAGE,
     );

     return (
          <div className="flex flex-col gap-6 bg-dashBg border border-navB py-4 px-2 md:px-7 rounded-xl">
               <div className="text-muted font-medium text-sm">{heading}</div>

               <table className="w-full border-separate border-spacing-y-3">
                    <thead>
                         <tr className="text-xs text-muted uppercase">
                              <th className="text-left font-medium">Cities</th>
                              <th className="text-right font-medium">Clicks</th>
                              <th className="text-right font-medium">%</th>
                              <th className="text-right font-medium">
                                   vs prev.
                              </th>
                         </tr>
                    </thead>

                    <tbody>
                         {currentData.map((d) => (
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

               <div className="flex justify-end items-center gap-2 mt-1">
                    <button
                         onClick={() => setPage((p) => p - 1)}
                         disabled={page === 0}
                         className="flex h-8 w-8 items-center justify-center rounded-md border border-navB bg-dashBg text-dashText transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                    >
                         <MdKeyboardArrowLeft className="text-xl" />
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                         <button
                              key={index}
                              onClick={() => setPage(index)}
                              className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition cursor-pointer
        ${
             page === index
                  ? "bg-blue-600 text-white"
                  : "border border-navB bg-dashBg text-muted hover:bg-white/10 hover:text-white"
        }`}
                         >
                              {index + 1}
                         </button>
                    ))}

                  
                    <button
                         onClick={() => setPage((p) => p + 1)}
                         disabled={page === totalPages - 1}
                         className="flex h-8 w-8 items-center justify-center rounded-md border border-navB bg-dashBg text-dashText transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                    >
                         <MdKeyboardArrowRight className="text-xl" />
                    </button>
               </div>
          </div>
     );
}

export default CitieTable;
