"use client";

import { LinkProps } from "@/types";
import  LinkRoute  from "next/link";
import Image from "next/image";

import {
     MdContentCopy,
     MdOutlineSubdirectoryArrowRight,
     MdEdit,
     MdDelete,
} from "react-icons/md";
import { IoAnalyticsSharp } from "react-icons/io5";
import { IoIosCheckmarkCircle, IoMdShare  } from "react-icons/io";
import { useState } from "react";

function Link({ link, image }: LinkProps) {
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
          <div className=" flex flex-row justify-between  gap-2 cursor-pointer bg-dashBg px-5 py-5 rounded-xl">
               <div className="w-[70%] flex gap-3 ">
                    <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-[#fb5a721f] border border-[#fb5a7247] rounded-md text-[#fb5a72]">
                         {!image && (
                              <div className="w-4 h-4 rounded bg-[#fb5a72]/30 animate-pulse" />
                         )}
                         <Image
                              src={image}
                              alt="nbb"
                              width={15}
                              height={15}
                              unoptimized
                         />
                    </div>

                    <div className="min-w-0 flex-1 flex flex-col gap-2.5">
                         <div className="truncate text-muted font-medium hover:underline">
                              <LinkRoute href={`/links/${link.id}`}>
                                   {link.title}
                              </LinkRoute>
                         </div>
                         <h5 className="font-bold text-[13px] text-foreground/80 truncate flex items-center gap-3">
                              <a
                                   href={link.shortUrl}
                                   target="_blank"
                                   className="text-short hover:underline"
                              >
                                   {link.shortUrl?.replace(/^https?:\/\//, "")}
                              </a>
                              <button
                                   onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopy(link.id, link.shortUrl);
                                   }}
                                   className="cursor-pointer text-short"
                              >
                                   {copied === link.id ? (
                                        <IoIosCheckmarkCircle />
                                   ) : (
                                        <MdContentCopy />
                                   )}
                              </button>
                         </h5>
                         <a
                              href={link.longUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex min-w-0 items-center gap-1.5 text-xs text-muted hover:underline"
                         >
                              <MdOutlineSubdirectoryArrowRight className="shrink-0" />

                              <span className="truncate">{link.longUrl}</span>
                         </a>
                    </div>
               </div>
               <div className="px-4 md:px-10 flex flex-col md:flex-row gap-2 md:gap-7">
                    <MdEdit className="w-5 h-5" />
                    <IoMdShare className="w-5 h-5" />
                    <LinkRoute href={`/links/${link.id}`}>
                         {" "}
                         <IoAnalyticsSharp className="w-5 h-5" />
                    </LinkRoute>
                    <MdDelete className="w-5 h-5" />
               </div>
          </div>
     );
}

export default Link;
