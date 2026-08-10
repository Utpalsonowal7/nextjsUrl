import Link from "next/link";

export default function LinkExpired() {
     return (
          <main className="min-h-screen flex items-center justify-center bg-background px-4">
               <div className="w-full max-w-md text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 text-2xl">
                         🔗
                    </div>

                    <h1 className="text-2xl font-bold">Link Expired</h1>

                    <p className="mt-3 text-muted">
                         This short link has expired and is no longer available.
                    </p>

                    <Link
                         href="/"
                         className="inline-block mt-6 rounded-lg bg-[#c41e3a] px-5 py-2.5 text-sm font-medium text-white"
                    >
                         Go to LnkShrt
                    </Link>
               </div>
          </main>
     );
}
