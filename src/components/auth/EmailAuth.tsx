"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Link as LinkIcon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { API_BASE_URL } from "@/api/config";
import { useAppDispatch } from "@/lib/hooks";
import { getCurrentUser } from "@/lib/features/auth/authThunks";
import { button, secondary, input, Notice } from "@/components/workspace/ui";

// Auth failures must not invoke the authenticated client's refresh interceptor.
const auth = axios.create({ baseURL: API_BASE_URL, withCredentials: true, timeout: 30000 });
type Step = "login" | "register" | "verify" | "forgot" | "reset";

function messageFor(error: unknown) {
  if (axios.isAxiosError<{ message?: string; errors?: string[] }>(error)) {
    return error.response?.data.errors?.join(" · ") || error.response?.data.message ||
      "Could not connect. Please try again.";
  }
  return "Could not finish signing in. Please try again.";
}

export default function EmailAuth({ mode }: { mode: "login" | "register" }) {
  const [step, setStep] = useState<Step>(mode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const address = email.trim().toLowerCase();
  const titles: Record<Step, string> = {
    login: "Welcome back.", register: "Make every link count.",
    verify: "Check your inbox.", forgot: "Forgot your password?", reset: "Choose a new password.",
  };
  function go(next: Step) {
    setStep(next); setError(""); setNotice(""); setPassword(""); setConfirm(""); setOtp("");
  }
  async function resend() {
    if (!address) { setError("Enter your email address first."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      await auth.post("/auth/resend-otp", { email: address });
      setNotice("A verification code has been sent. Check your inbox and spam folder.");
    } catch (err) { setError(messageFor(err)); }
    finally { setBusy(false); }
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError(""); setNotice("");
    if ((step === "register" || step === "reset") && password !== confirm) {
      setError("Passwords do not match."); return;
    }
    if (step === "register" && !/^(?=.{8,100}$)(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/.test(password)) {
      setError("Use 8–100 characters, including an uppercase letter, a number, and a special character."); return;
    }
    setBusy(true);
    try {
      if (step === "login") {
        await auth.post("/auth/login", { email: address, password });
        // Confirm HttpOnly cookies work before entering the signed-in workspace.
        try { await dispatch(getCurrentUser()).unwrap(); }
        catch { throw new Error("session"); }
        setPassword("");
        router.replace("/home");
      } else if (step === "register") {
        await auth.post("/auth/register", { name: name.trim(), email: address, password });
        go("verify");
        setNotice("Account created. Enter the 4-digit code sent to your email.");
      } else if (step === "verify") {
        await auth.post("/auth/verify-otp", { email: address, otp: Number(otp) });
        go("login");
        setNotice("Email verified. Sign in with your password.");
      } else if (step === "forgot") {
        await auth.post("/auth/forgot-password", { email: address });
        go("reset");
        setNotice("Enter the reset code sent to your email.");
      } else {
        await auth.post("/auth/reset-password", { email: address, otp: Number(otp), password });
        go("login");
        setNotice("Password updated. Sign in with your new password.");
      }
    } catch (err) {
      setError(err instanceof Error && err.message === "session"
        ? "Sign-in returned successfully, but your session could not be confirmed. Check cookie settings and try again."
        : messageFor(err));
    } finally { setBusy(false); }
  }
  const hasPassword = ["login", "register", "reset"].includes(step);
  return <main className="flex min-h-screen items-center justify-center px-5 py-12">
    <div className="w-full max-w-md">
      <Link href="/" className="mx-auto mb-10 flex w-fit items-center gap-2 font-bold text-xl">
        <span className="rounded-xl bg-[#c41e3a] p-2 text-white"><LinkIcon className="size-5" /></span>LnkShrt<span className="text-[#c41e3a]">.</span>
      </Link>
      <h1 className="text-center text-3xl font-bold tracking-tight">{titles[step]}</h1>
      <p className="mt-3 mb-7 text-center text-sm leading-6 text-muted">
        {step === "login" ? "Your links, pages, and insights—all in one place." :
         step === "register" ? "Create your account to start sharing more." :
         step === "verify" ? "Verify your email to activate password sign-in." :
         "We'll help you get back into your account."}
      </p>
      <section className="rounded-2xl border border-cardBorder bg-cardBg p-6 shadow-sm sm:p-8">
        {error && <Notice>{error}</Notice>}
        {notice && <Notice success>{notice}</Notice>}
        <form onSubmit={submit}>
          <fieldset disabled={busy} className="space-y-5">
            {step === "register" && <label className="block text-sm font-medium">Name
              <input className={input} autoComplete="name" maxLength={100} value={name} onChange={e => setName(e.target.value)} />
            </label>}
            <label className="block text-sm font-medium">Email address
              <input className={input} type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} />
            </label>
            {(step === "verify" || step === "reset") && <label className="block text-sm font-medium">4-digit code
              <input className={input} type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[1-9][0-9]{3}" maxLength={4} required value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))} />
            </label>}
            {hasPassword && <div><label htmlFor="auth-password" className="block text-sm font-medium">{step === "reset" ? "New password" : "Password"}</label>
              <div className="relative"><input id="auth-password" className={input + " pr-12"} type={show ? "text" : "password"}
                autoComplete={step === "login" ? "current-password" : "new-password"} required minLength={step === "login" ? 1 : 8}
                maxLength={step === "register" ? 100 : undefined} value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" aria-label={show ? "Hide password" : "Show password"} aria-pressed={show} onClick={() => setShow(v => !v)} className="absolute inset-y-0 right-0 mt-2 rounded-lg px-3 text-muted">
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {step === "register" && <p className="mt-2 text-xs leading-5 text-muted">8–100 characters, with an uppercase letter, number, and special character.</p>}
            </div>}
            {(step === "register" || step === "reset") && <label className="block text-sm font-medium">Confirm password
              <input className={input} type={show ? "text" : "password"} autoComplete="new-password" required value={confirm} onChange={e => setConfirm(e.target.value)} />
            </label>}
            {step === "login" && <button type="button" onClick={() => go("forgot")} className="block text-sm text-short hover:underline">Forgot password?</button>}
            <button type="submit" className={button + " w-full"}>{busy ? "Please wait…" :
              step === "login" ? "Sign in" : step === "register" ? "Create account" :
              step === "verify" ? "Verify email" : step === "forgot" ? "Send reset code" : "Reset password"}</button>
            {step === "verify" && <button type="button" onClick={resend} className={secondary + " w-full"}>Resend verification code</button>}
            {step === "reset" && <button type="button" onClick={() => go("forgot")} className="w-full text-sm text-short hover:underline">Request another reset code</button>}
            {step === "login" && <button type="button" onClick={() => go("verify")} className="w-full text-sm text-short hover:underline">Need to verify your email?</button>}
            {(step === "login" || step === "register") && <>
              <div className="flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-cardBorder" />or<span className="h-px flex-1 bg-cardBorder" /></div>
              <button type="button" className={secondary + " w-full"} onClick={() => { window.location.href = API_BASE_URL + "/auth/google"; }}><FcGoogle className="size-5" />Continue with Google</button>
            </>}
            {!["login", "register"].includes(step) && <button type="button" onClick={() => go("login")} className="w-full text-sm text-muted hover:underline">Back to sign in</button>}
          </fieldset>
        </form>
      </section>
      <p className="mt-6 text-center text-sm text-muted">{mode === "login" ? "New to LnkShrt? " : "Already have an account? "}
        <Link href={mode === "login" ? "/register" : "/login"} className="font-medium text-short hover:underline">{mode === "login" ? "Create an account" : "Sign in"}</Link>
      </p>
    </div>
  </main>;
}
