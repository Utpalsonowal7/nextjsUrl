import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

function Applayout({ children }: { children: React.ReactNode }) {
     return (
          <div className="grid md:grid-cols-[250px_1fr]">
               <aside className="hidden md:block ">
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

export default Applayout;
