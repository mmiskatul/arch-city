"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { label: "Pricing", href: "#pricing" },
  { label: "About Us", href: "#about" },
  { label: "Students", href: "#students" },
  { label: "Tutors", href: "#tutors" },
  { label: "Contact Us", href: "#contact" },
  { label: "FAQs", href: "#faqs" },
];

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-11 w-11 items-end justify-center overflow-hidden rounded-[0.95rem] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.24)]">
        <div className="absolute inset-x-1.5 top-1.5 h-5 rounded-full border-[3px] border-[#d71920] border-b-0" />
        <div className="absolute inset-x-2 bottom-2 h-4 rounded-t-md bg-[#101010]" />
        <div className="absolute bottom-2 left-[11px] h-3.5 w-1 rounded-full bg-white" />
        <div className="absolute bottom-2 left-[17px] h-4.5 w-1 rounded-full bg-white" />
        <div className="absolute bottom-2 left-[23px] h-3 w-1 rounded-full bg-white" />
      </div>
      <div className="leading-none">
        <div className="text-[0.95rem] font-extrabold uppercase tracking-[0.12em] text-[#f4f4f4]">
          <span className="text-[#ef242a]">ARCH CITY</span>
        </div>
        <div className="mt-1 text-[0.54rem] font-bold uppercase tracking-[0.42em] text-white">
          TUTORS
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1120px]">
        <div className="relative flex items-center justify-between gap-6">
          <Link href="/" aria-label="Arch City Tutors home" className="shrink-0">
            <BrandMark />
          </Link>

          <nav
            aria-label="Primary navigation"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 lg:flex"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[0.96rem] font-semibold text-white/92 transition hover:text-[#ef242a]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            <Link
              href="#login"
              className="text-[0.96rem] font-semibold text-white/92 transition hover:text-[#ef242a]"
            >
              Login
            </Link>
            <Link
              href="#create-account"
              className="inline-flex h-11 items-center rounded-full bg-[#ef242a] px-7 text-[0.96rem] font-bold text-white shadow-[0_14px_34px_rgba(239,36,42,0.3)] transition hover:bg-[#ff343a]"
            >
              Create Account
            </Link>
          </div>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white transition hover:bg-white/10 lg:hidden"
            onClick={() => setOpen((current) => !current)}
          >
            <span className="space-y-1.5">
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>
        </div>

        {open ? (
          <div
            id="mobile-nav"
            className="mt-4 rounded-[1.75rem] border border-white/10 bg-[#080808]/94 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl lg:hidden"
          >
            <nav aria-label="Mobile navigation" className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-white/86 transition hover:bg-white/6 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 grid gap-2">
                <Link
                  href="#login"
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-white/86 transition hover:bg-white/6 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="#create-account"
                  className="rounded-2xl bg-[#ef242a] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#ff343a]"
                  onClick={() => setOpen(false)}
                >
                  Create Account
                </Link>
              </div>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
