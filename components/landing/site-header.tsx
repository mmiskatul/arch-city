"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Pricing", href: "#pricing" },
  { label: "About Us", href: "#about" },
  { label: "Students", href: "#students" },
  { label: "Tutors", href: "#tutors" },
  { label: "Contact Us", href: "#contact" },
  { label: "FAQs", href: "#faqs" },
];

function BrandMark({ sticky = false }: { sticky?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-11 w-11 items-end justify-center overflow-hidden rounded-[0.95rem] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
        <div className="absolute inset-x-1.5 top-1.5 h-5 rounded-full border-[3px] border-[#d71920] border-b-0" />
        <div className="absolute inset-x-2 bottom-2 h-4 rounded-t-md bg-[#101010]" />
        <div className="absolute bottom-2 left-[11px] h-3.5 w-1 rounded-full bg-white" />
        <div className="absolute bottom-2 left-[17px] h-4.5 w-1 rounded-full bg-white" />
        <div className="absolute bottom-2 left-[23px] h-3 w-1 rounded-full bg-white" />
      </div>
      <div className="leading-none">
        <div
          className={`text-[0.95rem] font-extrabold uppercase tracking-[0.12em] ${
            sticky ? "text-[#222]" : "text-[#f4f4f4]"
          }`}
        >
          <span className="text-[#ef242a]">ARCH CITY</span>
        </div>
        <div
          className={`mt-1 text-[0.54rem] font-bold uppercase tracking-[0.42em] ${
            sticky ? "text-[#4a4a4a]" : "text-white"
          }`}
        >
          TUTORS
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  useEffect(() => {
    const marker = document.getElementById("hero-cta-threshold");

    if (!marker) {
      return;
    }

    const syncStickyHeader = () => {
      setShowStickyHeader(marker.getBoundingClientRect().top <= 24);
    };

    syncStickyHeader();
    window.addEventListener("scroll", syncStickyHeader, { passive: true });
    window.addEventListener("resize", syncStickyHeader);

    return () => {
      window.removeEventListener("scroll", syncStickyHeader);
      window.removeEventListener("resize", syncStickyHeader);
    };
  }, []);

  return (
    <>
      <header className="relative z-30 px-4 pt-5 sm:px-6 lg:px-8">
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
        </div>
      </header>

      {open ? (
        <div className="relative z-30 px-4 pt-4 sm:px-6 lg:hidden">
          <div
            id="mobile-nav"
            className="mx-auto max-w-[1120px] rounded-[1.75rem] border border-white/10 bg-[#080808]/94 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl"
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
        </div>
      ) : null}

      <div
        className={`pointer-events-none fixed inset-x-0 top-4 z-50 hidden px-4 transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform,filter] sm:px-6 lg:block ${
          showStickyHeader
            ? "translate-y-0 scale-100 opacity-100 blur-0"
            : "-translate-y-8 scale-[0.97] opacity-0 blur-[6px]"
        }`}
      >
        <div className="mx-auto max-w-[1120px]">
          <div
            className={`pointer-events-auto rounded-full border border-black/8 bg-white/96 px-4 py-2 backdrop-blur-xl transition-[box-shadow,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              showStickyHeader
                ? "shadow-[0_20px_60px_rgba(0,0,0,0.22)]"
                : "shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
            }`}
          >
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6">
              <Link
                href="/"
                aria-label="Arch City Tutors home"
                className="shrink-0"
              >
                <BrandMark sticky />
              </Link>

              <nav
                aria-label="Sticky navigation"
                className="flex items-center justify-center gap-10"
              >
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-[0.95rem] font-semibold text-[#343434] transition hover:text-[#ef242a]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-6">
                <Link
                  href="#login"
                  className="text-[0.95rem] font-semibold text-[#2b2b2b] transition hover:text-[#ef242a]"
                >
                  Login
                </Link>
                <Link
                  href="#create-account"
                  className="inline-flex h-11 items-center rounded-full bg-[#ef242a] px-7 text-[0.95rem] font-bold text-white shadow-[0_12px_30px_rgba(239,36,42,0.24)] transition hover:bg-[#ff343a]"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
