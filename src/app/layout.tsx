import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import "leaflet/dist/leaflet.css";
import StoreProvider from "./StoreProvider";
import AuthProvider from "./AuthProvider";
import { ToastProvider } from "@/components/ToastProvider";

const sora = Sora({
     subsets: ["latin"],
     weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
     title: "LnkShrt",
     description: "Url Shortner - Next gen",
};

export default function RootLayout({
     children,
}: Readonly<{
     children: React.ReactNode;
}>) {
     return (
          <html
               lang="en"
               className={`${sora.className} h-full antialiased`}
               suppressHydrationWarning
          >
               <body className="min-h-full flex flex-col">
                    <StoreProvider>
                         <ToastProvider>
                              <ThemeProvider
                                   attribute="class"
                                   defaultTheme="system"
                                   enableSystem
                                   disableTransitionOnChange
                              >
                                   <AuthProvider>{children}</AuthProvider>
                              </ThemeProvider>
                         </ToastProvider>
                    </StoreProvider>
               </body>
          </html>
     );
}
