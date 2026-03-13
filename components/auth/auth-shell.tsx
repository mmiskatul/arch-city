"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type AuthMode = "login" | "signup";

type AuthShellProps = {
  mode: AuthMode;
};

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3 3 18 18" />
      <path d="M10.6 10.7a3 3 0 0 0 4.2 4.2" />
      <path d="M9.9 5.1A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a18.8 18.8 0 0 1-3.2 4.2" />
      <path d="M6.6 6.6C4.1 8.3 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.3-1.5" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.2 2.2 4.8-5.2" />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10" />
      <path d="M15.5 9.5c0-1.1-1.6-2-3.5-2s-3.5.9-3.5 2 1.6 2 3.5 2 3.5.9 3.5 2-1.6 2-3.5 2-3.5-.9-3.5-2" />
    </svg>
  );
}

function ScreenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="5" width="16" height="11" rx="2" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12a8 8 0 1 1 16 0" />
      <path d="M4 13v2a2 2 0 0 0 2 2h2v-6H6a2 2 0 0 0-2 2Z" />
      <path d="M20 13v2a2 2 0 0 1-2 2h-2v-6h2a2 2 0 0 1 2 2Z" />
    </svg>
  );
}

const benefitItems = [
  {
    icon: <CheckCircleIcon />,
    label: "Trusted by students of Missouri",
  },
  {
    icon: <MoneyIcon />,
    label: "No hidden fees, only $5 scheduling fee",
  },
  {
    icon: <ScreenIcon />,
    label: "Top class vetted tutors",
  },
  {
    icon: <SupportIcon />,
    label: "24/7 support from our dedicated team",
  },
];

export function AuthShell({ mode }: AuthShellProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isLogin = mode === "login";

  return (
    <main className="min-h-screen bg-[#fafafa] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[2rem] bg-[#f3f0ef] shadow-[0_32px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-md">
            <Link href="/" aria-label="Arch City Tutors home" className="mx-auto block w-fit">
              <Image
                src="/logo-light.svg"
                alt="Arch City Tutors"
                width={160}
                height={56}
                priority
                className="h-auto w-[96px] sm:w-[108px]"
              />
            </Link>

            <div className="mt-9 text-center">
              <h1 className="text-4xl font-black tracking-[-0.05em] text-[#0f172a] sm:text-[3rem]">
                {isLogin ? "Hey, Welcome Back!" : "Create Your Account"}
              </h1>

              <p className="mt-5 text-lg leading-8 text-[#6b7280]">
                {isLogin
                  ? "A brand new day is here. It's your day to shape. Log in and find the perfect tutor for you."
                  : "Start your tutoring journey today. Create an account and connect with the right tutor for your goals."}
              </p>
            </div>

            <form className="mt-12 space-y-5">
              {isLogin ? null : (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#4b5563]">
                    Full name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="h-14 w-full rounded-xl border border-[#dbe0ea] bg-[#eef2f8] px-4 text-base text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#ef242a]"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#4b5563]">
                  {isLogin ? "Email address or student id" : "Email address"}
                </label>
                <input
                  type="email"
                  defaultValue={isLogin ? "admin@archcitytutors.com" : ""}
                  placeholder={isLogin ? "" : "you@example.com"}
                  className="h-14 w-full rounded-xl border border-[#dbe0ea] bg-[#eef2f8] px-4 text-base text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#ef242a]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#4b5563]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    defaultValue={isLogin ? "1234567891234" : ""}
                    placeholder={isLogin ? "" : "Create a strong password"}
                    className="h-14 w-full rounded-xl border border-[#dbe0ea] bg-[#eef2f8] px-4 pr-12 text-base text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#ef242a]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#6b7280]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              {isLogin ? null : (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#4b5563]">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    placeholder="Repeat your password"
                    className="h-14 w-full rounded-xl border border-[#dbe0ea] bg-[#eef2f8] px-4 text-base text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#ef242a]"
                  />
                </div>
              )}

              <div className="flex items-center justify-between gap-4 pt-1 text-sm sm:text-base">
                <label className="flex items-center gap-3 text-[#374151]">
                  <input type="checkbox" className="h-4 w-4 rounded border-[#d1d5db]" />
                  {isLogin ? "Remember me" : "I agree to the terms"}
                </label>

                <Link
                  href={isLogin ? "/signup" : "/login"}
                  className="font-medium text-[#ef242a] transition hover:text-[#c81a21]"
                >
                  {isLogin ? "I forgot my password" : "Already have an account?"}
                </Link>
              </div>

              <button
                type="submit"
                className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-[#df1620] text-lg font-bold text-white shadow-[0_18px_40px_rgba(223,22,32,0.22)] transition hover:bg-[#f02029]"
              >
                {isLogin ? "Log in" : "Create account"}
                <span className="ml-3" aria-hidden="true">
                  →
                </span>
              </button>
            </form>

            <p className="mt-6 text-center text-base text-[#4b5563]">
              {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
              <Link
                href={isLogin ? "/signup" : "/login"}
                className="font-semibold text-[#ef242a]"
              >
                {isLogin ? "Create an account" : "Log in"}
              </Link>
            </p>
          </div>
        </section>

        <aside className="hidden p-4 lg:flex">
          <div className="relative flex w-full flex-col overflow-hidden rounded-[1.8rem] ">
            <div className="relative min-h-[30rem] flex-1">
              <Image
                src="/signup-page-1.webp"
                alt="Student learning online with Arch City Tutors"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.18),rgba(17,17,17,0.04)_35%,rgba(17,17,17,0.28))]" />
            </div>

            <div className="absolute inset-x-4 bottom-4 rounded-[1.5rem] bg-white/98 p-6 shadow-[0_22px_60px_rgba(0,0,0,0.22)] backdrop-blur-sm">
              <div className="space-y-5">
                {benefitItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-4 text-[#111827]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fde8e8] text-[#df1620]">
                      {item.icon}
                    </div>
                    <div className="text-lg font-semibold tracking-[-0.02em]">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
