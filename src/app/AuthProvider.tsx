"use client";

import { useEffect } from "react";
import { getCurrentUser } from "@/lib/features/auth/authThunks";
import { useAppDispatch } from "@/lib/hooks";
import { usePathname } from "next/navigation";

const PUBLIC_ONLY_ROUTES = ["/login", "/signup"];

export default function AuthProvider({
     children,
}: {
     children: React.ReactNode;
}) {
     const dispatch = useAppDispatch();
       const pathname = usePathname();

   useEffect(() => {
        if (!PUBLIC_ONLY_ROUTES.includes(pathname)) {
             dispatch(getCurrentUser());
        }
   }, [pathname, dispatch]);


     return <>{children}</>;
}
