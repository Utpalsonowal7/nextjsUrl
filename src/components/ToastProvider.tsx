"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

type ToastType = "success" | "error";

interface Toast {
     message: string;
     type: ToastType;
}

interface ToastContextType {
     showToast: (message: string, type: ToastType) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
     const [toast, setToast] = useState<Toast | null>(null);

     const showToast = (message: string, type: ToastType) => {
          setToast({ message, type });
     };

     useEffect(() => {
          if (!toast) return;

          const timer = setTimeout(() => {
               setToast(null);
          }, 3000);

          return () => clearTimeout(timer);
     }, [toast]);

     return (
          <ToastContext.Provider value={{ showToast }}>
               {children}

               {toast && (
                    <div
                         className={`fixed right-5 top-5 z-[9999] flex w-full max-w-sm items-center gap-3 rounded-xl border bg-white px-4 py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.10)] ${
                              toast.type === "success"
                                   ? "border-green-200"
                                   : "border-red-200"
                         }`}
                    >
                         <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                   toast.type === "success"
                                        ? "bg-green-100 text-green-600"
                                        : "bg-red-100 text-red-600"
                              }`}
                         >
                              {toast.type === "success" ? (
                                   <IoCheckmarkCircle className="h-5 w-5" />
                              ) : (
                                   <IoCloseCircle className="h-5 w-5" />
                              )}
                         </div>

                         <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-900">
                                   {toast.type === "success"
                                        ? "Success"
                                        : "Error"}
                              </p>

                              <p className="mt-0.5 truncate text-xs text-gray-500">
                                   {toast.message}
                              </p>
                         </div>
                    </div>
               )}
          </ToastContext.Provider>
     );
};
