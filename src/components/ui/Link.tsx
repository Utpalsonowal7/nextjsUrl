"use client";

import { link } from "@/types";
import Image from "next/image";

import { MdContentCopy } from "react-icons/md";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useState } from "react";

function Link({ link, image }: link) {
     const [copied, setIsCopied] = useState<number | null | undefined>(null);

     const handleCopy = async (
          id: number | undefined,
          url: string | undefined,
     ) => {
          if (id === undefined || url === undefined) return;

          await navigator.clipboard.writeText(url);

          setIsCopied(id);

          setTimeout(() => {
               setIsCopied(null);
          }, 2000);
     };
     return (
          <div className=" flex flex-row   gap-2 cursor-pointer bg-dashBg px-15 py-5">
               <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-[#fb5a721f] border border-[#fb5a7247] rounded-md text-[##fb5a72]">
                    <Image
                         src={image}
                         alt="nbb"
                         width={15}
                         height={15}
                         unoptimized
                    />
               </div>

               <div className="min-w-0 flex-1 flex flex-col gap-5">
                    <h3 className="truncate">
                         <span>{link.desc}</span>
                    </h3>
                    <h5 className="font-bold text-[13px] text-foreground/80 truncate flex items-center gap-3">
                         <span>{link.shortLink}</span>
                         <button
                              onClick={(e) => {
                                   e.stopPropagation();
                                   handleCopy(link.id, link.shortLink);
                              }}
                              className="cursor-pointer"
                         >
                              {copied === link.id ? (
                                   <IoIosCheckmarkCircle />
                              ) : (
                                   <MdContentCopy />
                              )}
                         </button>
                    </h5>
                    <h6 className="text-xs text-muted truncate">
                         {link.longUrl}
                    </h6>
               </div>
          </div>
     );
}

export default Link;
