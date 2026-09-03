"use client";

import { useState } from "react";
import { MdClose, MdContentCopy } from "react-icons/md";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { CheckCircle2 } from "lucide-react";

import { ShortLink } from "@/types";

type Props = {
     open: boolean;
     onClose: () => void;
     link: ShortLink | null;
};

export default function LinkCreatedModal({ open, onClose, link }: Props) {
     const [copied, setCopied] = useState(false);

     if (!open || !link) return null;

     const copy = async () => {
          await navigator.clipboard.writeText(link.shortLink);

          setCopied(true);

          setTimeout(() => {
               setCopied(false);
          }, 2000);
     };

     return (
          <div
               className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-5"
               onClick={(e) => {
                    if (e.target === e.currentTarget) {
                         onClose();
                    }
               }}
          >
               <div className="relative w-full max-w-lg rounded-2xl border border-navB bg-dashBg p-4 shadow-2xl">
                    <button
                         onClick={onClose}
                         className="absolute right-5 top-5 text-muted hover:text-foreground transition cursor-pointer"
                    >
                         <MdClose size={22} />
                    </button>

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                         <CheckCircle2 size={40} className="text-green-500" />
                    </div>

                    <div className="mt-5 text-center">
                         <h2 className="text-2xl font-bold">
                              Link Created Successfully
                         </h2>

                         <p className="mt-2 text-sm text-muted">
                              Your short link is ready to share.
                         </p>
                    </div>

                    <div className="mt-8 rounded-xl border border-navB p-4">
                         <p className="mb-2 text-xs uppercase tracking-wide text-muted">
                              Short URL
                         </p>

                         <div className="flex items-center justify-between gap-3">
                              <span className="truncate font-medium">
                                   {link.shortLink}
                              </span>

                              <button
                                   onClick={copy}
                                   className="rounded-lg p-2 hover:bg-navB transition cursor-pointer"
                              >
                                   {copied ? (
                                        <IoIosCheckmarkCircle
                                             size={22}
                                             className="text-green-500"
                                        />
                                   ) : (
                                        <MdContentCopy size={20} />
                                   )}
                              </button>
                         </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-navB p-4">
                         <p className="mb-2 text-xs uppercase tracking-wide text-muted">
                              Original URL
                         </p>

                         <p className="truncate text-sm text-muted">
                              {link.longUrl}
                         </p>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                         <button
                              onClick={onClose}
                              className="py-2 text-sm text-muted transition hover:text-foreground cursor-pointer"
                         >
                              Create Another Link
                         </button>
                    </div>
               </div>
          </div>
     );
}
