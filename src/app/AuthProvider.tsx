"use client";

import { useEffect } from "react";
import { getCurrentUser } from "@/lib/features/auth/authThunks";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { currentUser } from "@/lib/features/auth/authSlice";
import { usePathname } from "next/navigation";

const PUBLIC_ONLY_ROUTES = ["/", "/login", "/signup", "/link-expired"];

export default function AuthProvider({
     children,
}: {
     children: React.ReactNode;
}) {
     const dispatch = useAppDispatch();
     const pathname = usePathname();
     const user = useAppSelector(currentUser);

     useEffect(() => {
          const isPublicRoute =
               PUBLIC_ONLY_ROUTES.includes(pathname) ||
               pathname.startsWith("/temp/");

          if (!isPublicRoute && !user) {
               dispatch(getCurrentUser());
          }
     }, [pathname, dispatch, user]);

     return <>{children}</>;
}
