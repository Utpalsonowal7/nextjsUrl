import React from "react";
import { Link2, NotepadText, QrCode, X } from "lucide-react";
import Link from "next/link";

type Props = {
     open: boolean;
     onClose: () => void;
};

export default function CreateModel({ open, onClose }: Props) {
     if (!open) return null;

     return (
          <div
               className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-5"
               onClick={(e) => {
                    if (e.target === e.currentTarget) onClose();
               }}
          >
               <div className="relative w-full flex flex-col rounded-xl border border-navB bg-dashBg px-5 py-5 max-w-5xl">
                    <button 
                         onClick={onClose}
                         className="absolute right-5 top-5 rounded-lg p-2 text-muted transition hover:bg-cardBg hover:text-dashText cursor-pointer"
                    >
                         <X size={20} className="cursor-pointer"/>
                    </button>

                    <div className="mb-8">
                         <h2 className="text-xl md:text-3xl font-bold text-dashText">
                              What do you want to create?
                         </h2>

                         <p className="mt-2 text-sm text-muted">
                              Select one of the following options to get
                              started.
                         </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                         <Link href="/links/create" className="flex md:flex-col gap-3 items-center px-2 py-2 group rounded-xl border border-navB  text-left transition-all hover:-translate-y-1 hover:border-short hover:shadow md:px-3 md:py-4" onClick={onClose}>
                              <div className=" flex h-5 w-5 items-center justify-center  rounded-2xl ">
                                   <Link2 className="text-[#4a67e7]" />
                              </div>

                              <h3 className="text-[17px] font-medium text-muted">
                                   Shorten a link
                              </h3>
                         </Link>

                         <Link href="" className="flex md:flex-col gap-3 items-center px-2 py-2 group rounded-xl border border-navB  text-left transition-all hover:-translate-y-1 hover:border-short hover:shadow md:px-3 md:py-4" onClick={onClose}>
                              <div className=" flex h-5 w-5 items-center justify-center rounded-2xl ">
                                   <QrCode className="text-[#c43a21]" />
                              </div>

                              <h3 className="text-[17px] font-medium text-muted">
                                   Generate a QR Code
                              </h3>
                         </Link>

                         <Link href="" className="flex md:flex-col gap-3 items-center px-2 py-2 group rounded-xl border border-navB  text-left transition-all hover:-translate-y-1 hover:border-short hover:shadow md:px-3 md:py-4"  onClick={onClose}>
                              <div className=" flex h-5 w-5 items-center justify-center rounded-2xl ">
                                   <NotepadText className="text-[#4153e2]" />
                              </div>

                              <h3 className="text-[17px] font-medium  text-muted">
                                   Build a landing Page
                              </h3>
                         </Link>
                    </div>
               </div>
          </div>
     );
}
