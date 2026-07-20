import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

function Theme() {
     const { resolvedTheme, setTheme } = useTheme();
     const [mounted, setMounted] = useState(false);

     useEffect(() => {
          setMounted(true);
     }, []);

     if (!mounted) {
          return (
               <div className="h-10 w-12 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></div>
          );
     }

     return (
          <div>
               <button
                    onClick={() =>
                         setTheme(resolvedTheme === "dark" ? "light" : "dark")
                    }
                    className="cursor-pointer"
               >
                    {resolvedTheme === "dark" ? <Sun /> : <Moon />}
               </button>
          </div>
     );
}

export default Theme;
