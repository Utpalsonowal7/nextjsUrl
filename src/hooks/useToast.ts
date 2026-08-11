"use client";

import { ToastContext } from "@/components/ToastProvider";
import { useContext } from "react";

export const useToast = () => {
     const context = useContext(ToastContext);

     if (!context) {
          throw new Error("useToast must be used inside ToastProvider");
     }

     return context;
};
