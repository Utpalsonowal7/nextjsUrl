"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { currentUser } from "@/lib/features/auth/authSlice";
import { state } from "@/lib/features/auth/authSlice";
import { useAppSelector } from "@/lib/hooks";
import CreateModel from "@/components/models/CreateModel";

function AppLayout({ children }: { children: React.ReactNode }) {
     const [showModal, setShowModal] = useState<boolean>(false);
     const user = useAppSelector(currentUser);
     const status = useAppSelector(state);
     const router = useRouter();

     // useEffect(() => {
     //      if (status === "failed") {
     //           router.push("/login");
     //      }
     // }, [status, router]);

     // if (!user) {
     //      return null;
     // }

     return (
          <div className="grid md:grid-cols-[250px_1fr]">
               <aside className="hidden md:block">
                    <Sidebar onCreate={() => setShowModal(true)} />
               </aside>
               <div className="min-w-0">
                    <header>
                         <Header onCreate={()=>setShowModal(true)}/>
                    </header>
                    <main className="mt-25">{children}</main>
               </div>

               <CreateModel
                    open={showModal}
                    onClose={() => setShowModal(false)}
               />
          </div>
     );
}

export default AppLayout;
