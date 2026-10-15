import { NextRequest, NextResponse } from "next/server";
export function proxy(request: NextRequest) {
  // Enable only when the canonical application hosts are explicitly configured.
  // The ingress must preserve Host and route only bio-domain roots to Next.js.
  const appHosts = process.env.APP_HOSTS?.split(",").map(host => host.trim().toLowerCase()).filter(Boolean);
  if (!appHosts?.length) return NextResponse.next();
  const rawHost = request.headers.get("host") || "";
  if (!rawHost || /[\s/@?#\\]/.test(rawHost)) return new NextResponse("Invalid host", { status: 400 });
  let hostname: string;
  try { hostname = new URL(`http://${rawHost}`).hostname.toLowerCase().replace(/\.$/, ""); }
  catch { return new NextResponse("Invalid host", { status: 400 }); }
  if (appHosts.includes(hostname) || ["localhost", "127.0.0.1"].includes(hostname)) return NextResponse.next();
  const destination = request.nextUrl.clone();
  destination.pathname = `/b/domain/${encodeURIComponent(hostname)}`;
  return NextResponse.rewrite(destination);
}
export const config = { matcher: ["/"] };
