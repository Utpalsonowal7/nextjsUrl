import React, { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { clearUser } from "@/lib/features/auth/authSlice";

import { GoSignOut } from "react-icons/go";

import api from "@/api/axios";

interface UserInfo {
     logo: string;
     name: string;
     email: string;
     isOpen: boolean;
}

function UserInfoModel({ isOpen, logo, name, email }: UserInfo) {
     const dispatch = useAppDispatch();
     const [error, setError] = useState("");
     if (!isOpen) return null;

     const handleLogOut = async () => {
          try { await api.post("/auth/logout"); dispatch(clearUser()); window.location.assign("/login"); }
          catch { setError("Could not sign out. Please try again."); }
     };

     return (
          <div className="fixed top-18 bg-dashBg right-3 rounded border border-navB">
               <div className="flex px-10 items-center gap-3 py-5 ">
                    <div className=" bg-[#c43a21] rounded-3xl">
                         <button className=" h-12 w-12 font-medium text-xl text-white text-center">
                              {logo}
                         </button>
                    </div>
                    <div>
                         <h4>{name}</h4>
                         <h4>{email}</h4>
                    </div>
               </div>
               {error && <p role="alert" className="px-5 text-sm text-red-500">{error}</p>}
               <hr className="text-navB h-1" />

               <div className="py-5 px-10">
                    <button
                         className="flex gap-2 items-center cursor-pointer text-muted hover:text-amber-600"
                         onClick={handleLogOut}
                    >
                         <GoSignOut />
                         <span>Sign Out</span>
                    </button>
               </div>
          </div>
     );
}

export default UserInfoModel;
