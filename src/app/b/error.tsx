"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center"><h1 className="text-2xl font-bold">We couldn’t load this page.</h1><p className="mt-4 text-sm text-muted">Please try again in a moment.</p><button onClick={reset} className="mt-6 rounded-xl bg-[#c41e3a] px-5 py-3 text-sm font-semibold text-white">Try again</button></main>;
}
