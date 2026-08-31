"use client";

import { FaXmark } from "react-icons/fa6";
import { FiCopy } from "react-icons/fi";

type VerifyDomain = {
     id: number;
     domain: string;
     isVerified: boolean;

     dns?: {
          routing: {
               type: string;
               name: string;
               value: string;
          };
     };
};

type VerifyDomainModalProps = {
     isOpen: boolean;
     onClose: () => void;
     domain: VerifyDomain;
     onVerify: () => void;
};

export default function VerifyDomainModal({
     isOpen,
     onClose,
     domain,
     onVerify,
}: VerifyDomainModalProps) {
     if (!isOpen) return null;

     const copy = async (value: string) => {
          await navigator.clipboard.writeText(value);
     };

     return (
          <div
               className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-8"
               onMouseDown={(e) => {
                    if (e.target === e.currentTarget) {
                         onClose();
                    }
               }}
          >
               <div className="w-full max-w-lg rounded-lg border border-navB bg-dashBg p-5 shadow-xl">
                    <div className="flex items-center justify-between">
                         <div>
                              <h2 className="text-lg font-semibold dash-dashText">
                                   Verify domain
                              </h2>

                              <p className="mt-1 text-sm text-muted">
                                   Connect{" "}
                                   <span className="font-medium">
                                        {domain.domain}
                                   </span>
                              </p>
                         </div>

                         <button
                              type="button"
                              onClick={onClose}
                              className="rounded p-1 text-muted transition hover:bg-navB"
                         >
                              <FaXmark size={18} />
                         </button>
                    </div>

                    <div className="mt-6">
                         <p className="text-sm text-muted">
                              Add the following DNS records at your domain
                              provider. Once they are added, click{" "}
                              <span className="font-medium dash-dashText">
                                   Verify Domain
                              </span>
                              .
                         </p>
                    </div>

                    {domain.dns?.routing && (
                         <div className="mt-5">
                              <h3 className="mb-3 text-sm font-semibold dash-dashText">
                                   Routing record
                              </h3>

                              <div className="rounded-lg border border-navB bg-background p-4">
                                   <div className="grid gap-4">
                                        {Object.entries(domain.dns.routing).map(
                                             ([key, value]) => (
                                                  <div key={key}>
                                                       <p className="mb-1 text-xs text-muted">
                                                            {key}
                                                       </p>

                                                       <div className="flex items-center gap-2 rounded border border-navB px-3 py-2">
                                                            <code className="min-w-0 flex-1 truncate text-xs dash-dashText">
                                                                 {value}
                                                            </code>

                                                            <button
                                                                 type="button"
                                                                 onClick={() =>
                                                                      copy(
                                                                           value,
                                                                      )
                                                                 }
                                                                 className="shrink-0 rounded p-1.5 text-muted transition hover:bg-navB"
                                                            >
                                                                 <FiCopy
                                                                      size={14}
                                                                 />
                                                            </button>
                                                       </div>
                                                  </div>
                                             ),
                                        )}
                                   </div>
                              </div>
                         </div>
                    )}

                    <div className="mt-6 flex justify-end gap-2">
                         <button
                              type="button"
                              onClick={onClose}
                              className="rounded border border-navB px-4 py-2 text-sm font-medium transition hover:bg-navB"
                         >
                              Cancel
                         </button>

                         <button
                              type="button"
                              onClick={onVerify}
                              className="rounded bg-[#c41e3a] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                         >
                              Verify Domain
                         </button>
                    </div>
               </div>
          </div>
     );
}
