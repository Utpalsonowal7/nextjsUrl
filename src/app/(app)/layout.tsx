"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { currentUser } from "@/lib/features/auth/authSlice";
import { state } from "@/lib/features/auth/authSlice";
import { useAppSelector } from "@/lib/hooks";

function AppLayout({ children }: { children: React.ReactNode }) {
     const user = useAppSelector(currentUser);
     const status = useAppSelector(state);
     const router = useRouter();

     useEffect(() => {
          if (status === "failed") {
               router.push("/login");
          }
     }, [status, router]);

     if (!user) {
          return null; 
     }

     return (
          <div className="grid md:grid-cols-[250px_1fr]">
               <aside className="hidden md:block">
                    <Sidebar />
               </aside>
               <div className="min-w-0">
                    <header>
                         <Header />
                    </header>
                    <main>{children}</main>
               </div>
          </div>
     );
}

export default AppLayout;
