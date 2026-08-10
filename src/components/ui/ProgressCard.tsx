import React from 'react'

import { CardData } from '@/types';

interface ProgressProps {
     data: CardData[];
     length:number
}

function ProgressCard({data, length}:ProgressProps) {
     return (
       <div className="w-full flex flex-col gap-3 ">
                                     {data.map((c) => (
                                          <div
                                               key={c.name}
                                               className="w-full flex items-center justify-between  "
                                          >
                                               <div className="w-[25%] ">
                                                    <span className="font-bold text-[13px] text-foreground/80 truncate flex items-center gap-3">
                                                         {c.name}
                                                    </span>
                                               </div>
                                               <div className="w-[40%] rounded">
                                                    <div
                                                         className=" bg-[#fc5a72] h-2 rounded"
                                                         style={{
                                                              width: `${(c.value / length) * 100}%`,
                                                         }}
                                                    ></div>
                                               </div>
                                               <div className="w-[15%] text-center text-muted text-xs">
                                                    {c.value}
                                               </div>
                                          </div>
                                     ))}
                                </div>
  )
}

export default ProgressCard