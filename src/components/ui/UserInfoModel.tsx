import React from "react";

interface UserInfo {
     logo: string;
     name: string;
     email: string;
     isOpen: boolean;
}

function UserInfoModel({ isOpen, logo, name, email }: UserInfo) {

     if (!isOpen) return;

     return (
          <div className="fixed top-18 bg-dashBg right-3 rounded">
               <div className="flex px-10 items-center gap-3 py-5">
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
          </div>
     );
}

export default UserInfoModel;
