"use client";

import { FcGoogle } from "react-icons/fc";
import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";

function login() {
     const handleLogin = () => {
          window.location.href = `${process.env.NEXT_PUBLIC_BACkEND_URL}auth/google`;
     }
     return (
          <div className="min-h-screen flex justify-center">
               <div className="flex flex-col justify-center items-center gap-10 py-10">
                    <div className="flex gap-1 bg-foreground text-background font-bold py-3 px-3 rounded">
                         <LinkIcon />
                         <h1>LnkShrt</h1>
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                         <h5 className="font-medium text-3xl text-title">
                              Welcome Back
                         </h5>
                         <p className="font-sm text-muted">
                              Sign to your account
                         </p>
                    </div>
                    <div className="flex flex-col gap-4 bg-cardBg border border-cardBorder py-10 px-6  md:px-18 bg-">
                         <button className="flex items-center bg-background rounded gap-2 border border-cardBorder px-6 py-3 cursor-pointer" onClick={handleLogin}>
                              <FcGoogle />
                              <span>Continue with Google</span>
                         </button>
                    </div>
                    <div className="flex text-muted gap-1">
                         <p>Don&apos;t have account?</p>
                         <Link href="/register" className="text-[#c43a21]">Sign up</Link>
                    </div>
               </div>
          </div>
     );
}

export default login;
