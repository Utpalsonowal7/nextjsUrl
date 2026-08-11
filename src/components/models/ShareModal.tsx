"use client";

import {
     FaWhatsapp,
     FaXTwitter,
     FaFacebook,
     FaTelegram,
     FaLinkedin,
} from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

import { useState } from "react";

interface ShareModalProps {
     isOpen: boolean;
     onClose: () => void;
     link: string;
}

interface ShareLink {
     name: string;
     icon: React.ReactNode;
     url: string;
}

const ShareModal = ({ isOpen, onClose, link }: ShareModalProps) => {
     const [isCopied, setIsCopied] = useState<boolean>(false);

     if (!isOpen) return null;

     const shareLinks: ShareLink[] = [
          {
               name: "WhatsApp",
               icon: <FaWhatsapp />,
               url: `https://wa.me/?text=${encodeURIComponent(link)}`,
          },
          {
               name: "X",
               icon: <FaXTwitter />,
               url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}`,
          },
          {
               name: "Facebook",
               icon: <FaFacebook />,
               url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
          },
          {
               name: "Telegram",
               icon: <FaTelegram />,
               url: `https://t.me/share/url?url=${encodeURIComponent(link)}`,
          },
          {
               name: "LinkedIn",
               icon: <FaLinkedin />,
               url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
          },
     ];

     const copyLink = async () => {
          await navigator.clipboard.writeText(link);

          setIsCopied(true);

          setTimeout(() => {
               setIsCopied(false);
          }, 3000);
     };

     return (
          <div
               className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
               onClick={(e) => {
                    if (e.target === e.currentTarget) {
                         onClose();
                    }
               }}
          >
               <div className="w-[90%] max-w-md rounded-xl bg-dashBg p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                         <h2 className="text-lg font-semibold">
                              Share your link
                         </h2>

                         <button
                              onClick={onClose}
                              className="cursor-pointer text-gray-500 hover:text-black"
                         >
                              <IoClose size={22} />
                         </button>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border p-3">
                         <span className="flex-1 truncate text-sm">{link}</span>

                         <button
                              onClick={copyLink}
                              className="text-sm font-medium hover:text-amber-600"
                         >
                              {isCopied ? "Copied" : "Copy"}
                         </button>
                    </div>

                    <div className="mt-6 flex justify-center gap-5">
                         {shareLinks.map((item) => (
                              <a
                                   key={item.name}
                                   href={item.url}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   title={`Share on ${item.name}`}
                                   className="flex h-11 w-11 items-center justify-center rounded-full border text-lg transition hover:border-amber-500 hover:text-amber-600"
                              >
                                   {item.icon}
                              </a>
                         ))}
                    </div>
               </div>
          </div>
     );
};

export default ShareModal;
