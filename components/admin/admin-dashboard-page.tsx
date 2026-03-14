"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import {
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiCheckSquare,
  FiChevronLeft,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiHelpCircle,
  FiHome,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiMonitor,
  FiPhone,
  FiUser,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";

type NavItem = {
  label: string;
  href: string;
  icon: IconType;
  active?: boolean;
  external?: boolean;
};

type StatCard = {
  title: string;
  value: string;
  action: string;
  icon: IconType;
  href: string;
};

const menuItems: NavItem[] = [
  { label: "Overview", href: "/admin-dashboard", icon: FiHome, active: true },
  { label: "Applications", href: "#", icon: FiFileText },
  { label: "Users", href: "#", icon: FiUsers },
  { label: "Schedules", href: "#", icon: FiCalendar },
  { label: "My Profile", href: "#", icon: FiUser },
];

const supportItems: NavItem[] = [
  { label: "FAQs", href: "/faqs", icon: FiHelpCircle },
  { label: "Arch Guide", href: "#", icon: FiBookOpen },
];

const socialItems: NavItem[] = [
  { label: "Youtube", href: "https://www.youtube.com", icon: FaYoutube, external: true },
  { label: "Facebook", href: "https://www.facebook.com", icon: FaFacebookF, external: true },
  { label: "Instagram", href: "https://www.instagram.com", icon: FaInstagram, external: true },
];

const statCards: StatCard[] = [
  { title: "Applications to Review", value: "0", action: "View", icon: FiFileText, href: "#" },
  { title: "Subscription Fee Collected", value: "$1,195", action: "View", icon: FiCheckSquare, href: "#" },
  { title: "Scheduling Fee Collected", value: "$915", action: "View", icon: FiDollarSign, href: "#" },
  { title: "Total Users", value: "672", action: "View all", icon: FiUsers, href: "#" },
  { title: "Subscribed Users", value: "1", action: "View all", icon: FiCheckSquare, href: "#" },
  { title: "Subscribed Parents", value: "16", action: "View all", icon: FiClock, href: "#" },
  { title: "Active Tutors", value: "168", action: "View all", icon: FiMonitor, href: "#" },
  { title: "Tutoring Sessions", value: "183", action: "View all", icon: FiCalendar, href: "#" },
  { title: "Upcoming Tutoring Sessions", value: "1", action: "View all", icon: FiClock, href: "#" },
  { title: "Completed Tutoring Sessions", value: "85", action: "View all", icon: FiCheckCircle, href: "#" },
  { title: "Cancelled Tutoring Sessions", value: "97", action: "View all", icon: FiXCircle, href: "#" },
];

const hiddenScrollbarStyle: CSSProperties = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

function SidebarSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-5 text-[11px] font-semibold tracking-[0.08em] text-[#9ca3af]">
      {children}
    </p>
  );
}

function SidebarLink({ item, collapsed = false }: { item: NavItem; collapsed?: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noreferrer" : undefined}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-medium transition ${
        item.active
          ? "bg-[#fde9ea] text-[#ef242a]"
          : "text-[#1f2937] hover:bg-[#f5f6f8]"
      }`}
      aria-label={item.label}
      title={item.label}
    >
      <Icon className="h-5 w-5" />
      {!collapsed ? <span>{item.label}</span> : null}
    </Link>
  );
}

function StatCardView({ card }: { card: StatCard }) {
  const Icon = card.icon;

  return (
    <article className="rounded-[24px] border border-[#ececec] bg-white p-6 shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
      <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#db1820] text-white">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[15px] text-[#6b7280]">{card.title}</p>
          <p className="mt-1 text-[18px] font-bold text-[#111827]">{card.value}</p>
        </div>
        <Link
          href={card.href}
          className="rounded-xl bg-[#ef242a] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#d91b21]"
        >
          {card.action}
        </Link>
      </div>
    </article>
  );
}

export function AdminDashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <main className="h-screen overflow-hidden bg-[#f6f6f7] text-[#111827]">
      <div className="flex h-full flex-col lg:flex-row">
        <aside
          className={`w-full border-b border-[#ececec] bg-white transition-[width] duration-300 lg:h-screen lg:shrink-0 lg:border-r lg:border-b-0 ${
            sidebarCollapsed ? "lg:w-[96px]" : "lg:w-[280px]"
          }`}
        >
          <div
            className={`flex border-b border-[#f0f0f0] px-5 py-6 ${
              sidebarCollapsed ? "justify-center" : "items-center justify-between"
            }`}
          >
            <Link href="/" className="flex items-center" aria-label="Go to home">
              {sidebarCollapsed ? (
                <Image
                  src="/logo-primary.85801dda.svg"
                  alt="Arch City Tutors"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                  priority
                />
              ) : (
                <Image
                  src="/logo-primary.85801dda.svg"
                  alt="Arch City Tutors"
                  width={136}
                  height={40}
                  className="h-auto w-[136px]"
                  priority
                />
              )}
            </Link>
            <button
              type="button"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ececec] text-[#9ca3af]"
              onClick={() => setSidebarCollapsed((current) => !current)}
            >
              <FiChevronLeft
                className={`h-4 w-4 transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          <div
            className={`space-y-8 overflow-y-auto px-5 py-5 lg:h-[calc(100vh-89px)] ${
              sidebarCollapsed ? "lg:px-3" : ""
            } [&::-webkit-scrollbar]:hidden`}
            style={hiddenScrollbarStyle}
          >
            <div className="space-y-3">
              {!sidebarCollapsed ? <SidebarSectionLabel>MAIN MENU</SidebarSectionLabel> : null}
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <SidebarLink key={item.label} item={item} collapsed={sidebarCollapsed} />
                ))}
              </nav>
            </div>

            <div className="space-y-3">
              {!sidebarCollapsed ? <SidebarSectionLabel>SUPPORT</SidebarSectionLabel> : null}
              <nav className="space-y-1">
                {supportItems.map((item) => (
                  <SidebarLink key={item.label} item={item} collapsed={sidebarCollapsed} />
                ))}
              </nav>
            </div>

            <div className="space-y-3">
              {!sidebarCollapsed ? <SidebarSectionLabel>CONNECT WITH US</SidebarSectionLabel> : null}
              <nav className="space-y-1">
                {socialItems.map((item) => (
                  <SidebarLink key={item.label} item={item} collapsed={sidebarCollapsed} />
                ))}
              </nav>
            </div>

            <div className={`space-y-3 ${sidebarCollapsed ? "hidden" : ""}`}>
              <SidebarSectionLabel>CONTACT US</SidebarSectionLabel>
              <div className="rounded-[22px] bg-[#f8f8f8] p-4">
                <div className="space-y-4 text-[15px] text-[#1f2937]">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#ef242a] text-white">
                      <FiPhone className="h-4 w-4" />
                    </span>
                    <span>(314) 252-0967</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#ef242a] text-white">
                      <FiMail className="h-4 w-4" />
                    </span>
                    <span>info@archcitytutors.com</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#ef242a] text-white">
                      <FiMapPin className="h-4 w-4" />
                    </span>
                    <span>8011 Clayton Road, Third Floor St. Louis, Missouri 63117</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section
          className="flex-1 overflow-y-auto px-5 py-6 sm:px-7 lg:h-screen lg:px-10 [&::-webkit-scrollbar]:hidden"
          style={hiddenScrollbarStyle}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-3 text-[18px] font-semibold shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
              <FiHome className="h-5 w-5 text-[#1f2937]" />
              <span>Admin Dashboard</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-[#0d1d57] px-4 py-3 text-sm font-semibold text-white">
                <FiCalendar className="h-4 w-4" />
                <span>{dateLabel}</span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0d1d57]">
                <Image
                  src="/logo-primary.85801dda.svg"
                  alt="Admin"
                  width={28}
                  height={28}
                  className="h-7 w-7"
                />
              </div>
              <Link
                href="/login"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ef4444] text-white transition hover:bg-[#dc2626]"
                aria-label="Log out"
              >
                <FiLogOut className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="mt-12">
            <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#111827]">
              Welcome Arch City Tutors!
            </h1>
            <p className="mt-2 text-lg text-[#6b7280]">
              A brand new day is here. It&apos;s your day to manage the platform.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {statCards.map((card) => (
              <StatCardView key={card.title} card={card} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
