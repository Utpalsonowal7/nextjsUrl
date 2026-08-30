"use client";

import { useState } from "react";
import { FaXmark } from "react-icons/fa6";

type AddDomainModalProps = {
     isOpen: boolean;
     onClose: () => void;
     onAdd: (domain: string) => void | Promise<void>;
};

export default function AddDomainModal({
     isOpen,
     onClose,
     onAdd,
}: AddDomainModalProps) {
     const [domain, setDomain] = useState("");

     if (!isOpen) return null;

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          const value = domain.trim();

          if (!value) return;

          await onAdd(value);

          setDomain("");
     };

     const handleClose = () => {
          setDomain("");
          onClose();
     };

     return (
          <div
               className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
               onMouseDown={(e) => {
                    if (e.target === e.currentTarget) handleClose();
               }}
          >
               <div className="w-full max-w-md rounded-lg border border-navB bg-dashBg p-5 shadow-xl">
                    <div className="flex items-center justify-between">
                         <h2 className="text-lg font-semibold dash-dashText">
                              Add a domain
                         </h2>

                         <button
                              type="button"
                              onClick={handleClose}
                              className="rounded p-1 text-muted transition hover:bg-navB"
                         >
                              <FaXmark size={18} />
                         </button>
                    </div>

                    <p className="mt-1 text-sm text-muted">
                         Add your custom domain for branded short links.
                    </p>

                    <form onSubmit={handleSubmit}>
                         <div className="mt-5">
                              <label className="text-sm font-medium dash-dashText">
                                   Domain
                              </label>

                              <input
                                   type="text"
                                   value={domain}
                                   onChange={(e) => setDomain(e.target.value)}
                                   placeholder="links.example.com"
                                   autoFocus
                                   className="mt-2 w-full rounded border border-navB bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#f59180]/30"
                              />

                              <p className="mt-2 text-xs text-muted">
                                   Enter your domain without https://
                              </p>
                         </div>

                         <div className="mt-6 flex justify-end gap-2">
                              <button
                                   type="button"
                                   onClick={handleClose}
                                   className="rounded border border-navB px-4 py-2 text-sm font-medium hover:bg-navB"
                              >
                                   Cancel
                              </button>

                              <button
                                   type="submit"
                                   disabled={!domain.trim()}
                                   className="rounded bg-[#c41e3a] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                   Add domain
                              </button>
                         </div>
                    </form>
               </div>
          </div>
     );
}
