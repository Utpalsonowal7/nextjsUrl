"use client";

import {
     House,
     Link2,
     QrCode,
     ChartColumn,
     NotepadText,
     Globe,
     Plus,
     Link as LinkIcon,
     Settings,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
     { name: "Home", icon: House, href: "/home" },
     { name: "Links", icon: Link2, href: "/links" },
     { name: "QR Codes", icon: QrCode, href: "/qr" },
     { name: "Analytics", icon: ChartColumn, href: "/analytics" },
     { name: "Pages", icon: NotepadText, href: "/pages" },
     { name: "Custom Domain", icon: Globe, href: "/domain" },
];

function Sidebar() {
     const [navShowing, setNavShowing] = useState<boolean>(false);

     const pathName = usePathname();

     return (
          <div className="min-h-screen fixed top-16 lg:top-0 left-0 w-full lg:w-62.5 border-r bg-dashBg border-navB">
               <div className="flex flex-col px-5 gap-4">
                    <div className="flex flex-col gap-5 py-5 border-b-2 border-cardBg">
                         <div className="hidden md:flex items-center gap-1  text-foreground font-extrabold rounded ">
                              <LinkIcon />
                              <h1>LnkShrt</h1>
                         </div>
                         <div
                              className=" bg-[#c41e3a] text-white py-2
                    px-3.5 text-center rounded shadow-xl outline-none"
                         >
                              {navShowing ? (
                                   <button className=" py-3 px-15 rounded shadow-sm">
                                        <Plus />{" "}
                                   </button>
                              ) : (
                                   <button>Create new</button>
                              )}
                         </div>
                    </div>

                    <div className="border-b-2 border-cardBg py-5">
                         <ul className="flex flex-col gap-5">
                              {navItems.map((ls) => (
                                   <Link
                                        href={ls.href}
                                        key={ls.name}
                                        className={`flex gap-4 px-3 py-1 items-center font-medium cursor-pointer   ${pathName === ls.href ? "border-l-4 text-white border-[#c43a21] bg-[#fb7b65] rounded" : "hover:rounded hover:bg-[#fb7b65]"}`}
                                   >
                                        <ls.icon className="w-5 h-5 shrink-0" />

                                        <span>{ls.name}</span>
                                   </Link>
                              ))}
                         </ul>
                    </div>

                    <div className="py-3">
                         <Link
                              href="/setting"
                              className="flex gap-4 py-1 px-3 items-center font-medium cursor-pointer hover:bg-[#fb7b65] hover:rounded"
                         >
                              <Settings className="w-5 h-5 shrink-0" />
                              <span>Settings</span>
                         </Link>
                    </div>
               </div>
          </div>
     );
}

export default Sidebar;
