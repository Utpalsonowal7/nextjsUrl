"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { currentUser } from "@/lib/features/auth/authSlice";
import { state } from "@/lib/features/auth/authSlice";
import { useAppSelector } from "@/lib/hooks";
import { Loading } from "@/components/workspace/ui";
import CreateModel from "@/components/models/CreateModel";

function AppLayout({ children }: { children: React.ReactNode }) {
     const [showModal, setShowModal] = useState<boolean>(false);
     const user = useAppSelector(currentUser);
     const status = useAppSelector(state);
     const router = useRouter();

     useEffect(() => {
          if (status === "failed") {
               router.push("/");
          }
     }, [status, router]);

     if (!user) {
          return <Loading label="Opening your workspace…" />;
     }

     return (
          <div className="grid md:grid-cols-[250px_1fr]">
               <aside className="fixed inset-y-0 left-0 z-40 hidden w-62.5 md:block">
                    <Sidebar onCreate={() => setShowModal(true)} />
               </aside>
               <div className="min-w-0 md:col-start-2">
                    <header>
                         <Header onCreate={()=>setShowModal(true)}/>
                    </header>
                    <main className="mx-auto mt-18 max-w-[1500px] py-8 pb-16 md:py-10">{children}</main>
               </div>

               <CreateModel
                    open={showModal}
                    onClose={() => setShowModal(false)}
               />
          </div>
     );
}

export default AppLayout;
