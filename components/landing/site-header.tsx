"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Pricing", href: "/pricing" },
  { label: "About Us", href: "/#about" },
  { label: "Students", href: "/#students" },
  { label: "Tutors", href: "/#tutors" },
  { label: "Contact Us", href: "/#contact" },
  { label: "FAQs", href: "/pricing#faqs" },
];

function SiteLogo({ sticky = false }: { sticky?: boolean }) {
  return (
    <Image
      src={sticky ? "/logo-light.svg" : "/logo-dark.svg"}
      alt="Arch City Tutors"
      width={130}
      height={40}
      priority
      className="h-auto w-[148px] sm:w-[164px]"
    />
  );
}

export function SiteHeader({
  thresholdId,
}: {
  thresholdId: string;
}) {
  const [open, setOpen] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  useEffect(() => {
    const marker = document.getElementById(thresholdId);

    if (!marker) {
      return;
    }

    let ticking = false;

    const syncStickyHeader = () => {
      const markerTop = marker.getBoundingClientRect().top + window.scrollY;
      const shouldShowSticky = window.scrollY >= markerTop - 88;

      setShowStickyHeader(shouldShowSticky);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(syncStickyHeader);
    };

    syncStickyHeader();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", syncStickyHeader);
    window.addEventListener("load", syncStickyHeader);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", syncStickyHeader);
      window.removeEventListener("load", syncStickyHeader);
    };
  }, [thresholdId]);

  return (
    <>
      <header
        className={`relative z-30 hidden bg-transparent px-4 pt-4 transition-[opacity,transform,visibility] duration-300 ease-out sm:px-6 sm:pt-5 lg:block lg:px-8 ${
          showStickyHeader
            ? "pointer-events-none invisible -translate-y-4 opacity-0"
            : "visible translate-y-0 opacity-100"
        }`}
      >
        <div className="mx-auto max-w-[1040px]">
          <div className="relative flex items-center justify-between gap-4 bg-transparent">
            <Link href="/" aria-label="Arch City Tutors home" className="shrink-0">
              <SiteLogo />
            </Link>

            <nav
              aria-label="Primary navigation"
              className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 lg:flex"
            >
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[0.9rem] font-semibold text-white/92 transition hover:text-[#ef242a]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-4 lg:flex">
              <Link
                href="#login"
                className="text-[0.9rem] font-semibold text-white/92 transition hover:text-[#ef242a]"
              >
                Login
              </Link>
              <Link
                href="#create-account"
                className="inline-flex h-10 items-center rounded-full bg-[#ef242a] px-5 text-[0.9rem] font-bold text-white shadow-[0_14px_34px_rgba(239,36,42,0.3)] transition hover:bg-[#ff343a]"
              >
                Create Account
              </Link>
            </div>

            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label="Toggle navigation menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-transparent text-white transition hover:bg-white/10 lg:hidden"
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

      <header className="relative z-30 bg-transparent px-4 pt-4 sm:px-6 sm:pt-5 lg:hidden">
        <div className="mx-auto max-w-[1040px]">
          <div className="relative flex items-center justify-between gap-6 bg-transparent">
            <Link href="/" aria-label="Arch City Tutors home" className="shrink-0">
              <SiteLogo />
            </Link>

            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label="Toggle navigation menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-transparent text-white transition hover:bg-white/10"
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
        <div className="mx-auto max-w-[1040px]">
          <div
            className={`pointer-events-auto rounded-full border border-black/8 bg-white/96 px-5 py-1.5 backdrop-blur-xl transition-[box-shadow,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              showStickyHeader
                ? "shadow-[0_20px_60px_rgba(0,0,0,0.22)]"
                : "shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
            }`}
          >
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
              <Link
                href="/"
                aria-label="Arch City Tutors home"
                className="shrink-0"
              >
                <SiteLogo sticky />
              </Link>

              <nav
                aria-label="Sticky navigation"
                className="flex items-center justify-center gap-7"
              >
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-[0.89rem] font-semibold text-[#343434] transition hover:text-[#ef242a]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-4">
                <Link
                  href="#login"
                  className="text-[0.89rem] font-semibold text-[#2b2b2b] transition hover:text-[#ef242a]"
                >
                  Login
                </Link>
                <Link
                  href="#create-account"
                  className="inline-flex h-10 items-center rounded-full bg-[#ef242a] px-5 text-[0.89rem] font-bold text-white shadow-[0_12px_30px_rgba(239,36,42,0.24)] transition hover:bg-[#ff343a]"
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
