import Link from "next/link";
export default function NotFound() {
  return <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center"><p className="text-xs font-semibold uppercase tracking-widest text-muted">LnkShrt pages</p><h1 className="mt-4 text-3xl font-bold">This page isn’t available.</h1><p className="mt-4 max-w-md text-sm leading-6 text-muted">It may be unpublished, removed, or the address may be incorrect.</p><Link className="mt-7 text-sm text-short underline" href="/">Back to LnkShrt</Link></main>;
}
