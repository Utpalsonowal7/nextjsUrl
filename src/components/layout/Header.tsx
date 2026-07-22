"use client";

import { RiMenu2Fill, RiCloseFill } from "react-icons/ri";
import { useState } from "react";
import Theme from "../theme";
import Sidebar from "./Sidebar";

const user = "Utpal";

function Header() {
     const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);

     return (
          <div className="border-b z-20 fixed top-0 right-0 left-0 lg:left-62.5 px-3.5  border-navB lg:px-20 backdrop-blur-2xl bg-background/70">
               <div className="w-full flex items-center justify-between py-3
               lg:flex-row-reverse">
                    <div className="flex items-center gap-6 md:hidden">
                         {isSideBarOpen ? (
                              <RiCloseFill
                                   onClick={() =>
                                        setIsSideBarOpen((pre) => !pre)
                                   }
                                   size={35}
                              />
                         ) : (
                              <RiMenu2Fill
                                   onClick={() =>
                                        setIsSideBarOpen((pre) => !pre)
                                   }
                                   size={30}
                              />
                         )}

                         <h2 className="flex  text-white py-1 px-2 rounded bg-[#c41e3a]">
                              LnkShrt
                         </h2>
                    </div>

                    <div className="flex items-center gap-3">
                         <div className="mt-1.5">
                              <Theme />
                         </div>
                         <div>
                              <button className="font-medium h-8 w-8 text-center text-xl bg-[#c43a21] text-white rounded-full">
                                   {user.slice(0, 1).toLocaleUpperCase()}
                              </button>
                         </div>
                    </div>
               </div>

               <div className="w-full">
                    {isSideBarOpen && (
                         <div>
                              <Sidebar />
                         </div>
                    )}
               </div>
          </div>
     );
}

export default Header;
