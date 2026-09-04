import { UserRound } from "lucide-react";

export default function BioPage() {
     return (
          <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
               <div className="w-full max-w-2xl text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-cardBorder bg-cardBg">
                         <UserRound className="h-8 w-8 text-muted" />
                    </div>

                    <p className="mb-3 text-sm font-medium uppercase tracking-wider text-short">
                         Bio Page
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight text-dashText sm:text-5xl">
                         Your bio page is coming soon.
                    </h1>

                    <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-muted">
                         Create a personalized page to share your links, social
                         profiles, projects, and everything you want people to
                         discover.
                    </p>

                    <div className="mt-8 inline-flex items-center rounded-full border border-cardBorder bg-cardBg px-5 py-2.5 text-sm font-medium text-dashText">
                         Coming Soon 
                    </div>
               </div>
          </main>
     );
}
