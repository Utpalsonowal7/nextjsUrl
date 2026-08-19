"use client";

import { userQrs } from "@/types";
import LinkRoute from "next/link";
import Image from "next/image";

import {
     MdContentCopy,
     MdOutlineSubdirectoryArrowRight,
     MdEdit,
     MdDelete,
} from "react-icons/md";
import { IoAnalyticsSharp } from "react-icons/io5";
import { IoIosCheckmarkCircle, IoMdShare } from "react-icons/io";
import { useState } from "react";

import DeleteModal from "../models/DeleteModel";
import ShareModal from "../models/ShareModal";

interface QrProps {
     data: userQrs;
}

function Qr({ data }: QrProps) {
     const [copied, setIsCopied] = useState<number | null | undefined>(null);
     const [shareOpen, setShareOpen] = useState(false);
     const [shareLink, setShareLink] = useState("");
     const [id, setId] = useState<number>(0);
     const [openModel, setOpenModel] = useState<boolean>(false);

     const handleShare = (link: string) => {
          setShareLink(link);
          setShareOpen(true);
     };

     const handleDelete = (id: number) => {
          setId(id);
          setOpenModel(true);
     };

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
                    <div className="w-25 h-25 shrink-0 flex items-center justify-center bg-[#fb5a721f] border border-[#fb5a7247] rounded-md text-[#fb5a72]">
                         {!data.qrUrl && (
                              <div className="w-4 h-4 rounded bg-[#fb5a72]/30 animate-pulse" />
                         )}
                         <Image
                              src={data.qrUrl}
                              alt="nbb"
                              width={100}
                              height={100}
                              
                         />
                    </div>

                    <div className="min-w-0 flex-1 flex flex-col gap-2.5">
                         <div className="truncate text-muted font-medium hover:underline">
                              <LinkRoute href={`/links/${data.id}`}>
                                   {data.title}
                              </LinkRoute>
                         </div>
                         <h5 className="font-bold text-[13px] text-foreground/80 truncate flex items-center gap-3">
                              <a
                                   href={data.shortUrl}
                                   target="_blank"
                                   className="text-short hover:underline"
                              >
                                   {data.shortUrl?.replace(/^https?:\/\//, "")}
                              </a>
                              <button
                                   onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopy(data.id, data.shortUrl);
                                   }}
                                   className="cursor-pointer text-short"
                              >
                                   {copied === data.id ? (
                                        <IoIosCheckmarkCircle />
                                   ) : (
                                        <MdContentCopy />
                                   )}
                              </button>
                         </h5>
                         <a
                              href={data.longUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex min-w-0 items-center gap-1.5 text-xs text-muted hover:underline"
                         >
                              <MdOutlineSubdirectoryArrowRight className="shrink-0" />

                              <span className="truncate">{data.longUrl}</span>
                         </a>
                    </div>
               </div>
               <div className="px-4 md:px-10 flex flex-col md:flex-row gap-2 md:gap-7">
                    <MdEdit className="w-5 h-5" />
                    <IoMdShare
                         className="w-5 h-5"
                         onClick={() => handleShare(data.shortUrl)}
                    />
                    <LinkRoute href={`/links/${data.id}`}>
                         {" "}
                         <IoAnalyticsSharp className="w-5 h-5" />
                    </LinkRoute>
                    <MdDelete
                         className="w-5 h-5"
                         onClick={() => handleDelete(data.id)}
                    />
               </div>

               <ShareModal
                    isOpen={shareOpen}
                    onClose={() => setShareOpen(false)}
                    link={shareLink}
               />

               <DeleteModal
                    isOpen={openModel}
                    onClose={() => setOpenModel(false)}
                    id={id}
               />
          </div>
     );
}

export default Qr;
