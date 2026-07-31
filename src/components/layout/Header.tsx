"use client";

import {
     RiMenu2Fill,
     RiCloseFill,
     RiArrowDropDownFill,
     RiArrowDropUpFill,
} from "react-icons/ri";
import { useState } from "react";
import Theme from "../theme";
import Sidebar from "./Sidebar";
import UserInfoModel from "../ui/UserInfoModel";
import { currentUser } from "@/lib/features/auth/authSlice";
import { useAppSelector } from "@/lib/hooks";

const userOffine = {
     name: "Utpal Sonowal",
     email: "sonowalu73@gmail.com",
};

function Header() {
     const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);
     const [isUserModelOpen, setIsUserModelOpen] = useState<boolean>(false);

     const me = useAppSelector(currentUser)
     const user = me ?? userOffine;
     console.log(user)
    

     return (
          <>
               <div
                    className=" border-b z-20 fixed top-0 right-0 left-0 md:left-62.5 px-3.5  border-navB lg:px-6
          backdrop-blur-2xl bg-background/50"
               >
                    <div
                         className="w-full flex items-center justify-between py-3
               lg:flex-row-reverse"
                    >
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
                              <div
                                   className="flex items-center gap-2 cursor-pointer hover:bg-[#f8bbb5] py-1 px-1 rounded"
                                   onClick={() =>
                                        setIsUserModelOpen((pre) => !pre)
                                   }
                              >
                                   <div>
                                        <button className="font-medium h-8 w-8 text-center text-xl bg-[#c43a21] text-white rounded-full">
                                             {user.name
                                                  .slice(0, 1)
                                                  .toLocaleUpperCase()}
                                        </button>
                                   </div>
                                   <div>
                                        <span>{user.name.split(" ")[0]}</span>
                                   </div>
                                   <div>
                                        {isUserModelOpen ? <RiArrowDropUpFill /> : <RiArrowDropDownFill />}
                                   </div>
                              </div>
                         </div>
                    </div>

                    <div className="w-full">
                         {isSideBarOpen && (
                              <div onClick={()=>setIsSideBarOpen(pre=>!pre)}>
                                   <Sidebar />
                              </div>
                         )}
                    </div>
               </div>

               <UserInfoModel
                    isOpen={isUserModelOpen}
                    logo={user.name
                         .split(" ")
                         .map((word:string) => word[0])
                         .join("")
                         .toUpperCase()}
                    name={user.name}
                    email={user.email}
               />
          </>
     );
}

export default Header;
