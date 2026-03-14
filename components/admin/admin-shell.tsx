"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { IconType } from "react-icons";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import {
  FiBookOpen,
  FiCalendar,
  FiChevronLeft,
  FiFileText,
  FiHelpCircle,
  FiHome,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
  FiUsers,
} from "react-icons/fi";

type NavItem = {
  label: string;
  href: string;
  icon: IconType;
  external?: boolean;
};

const hiddenScrollbarStyle: CSSProperties = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

const menuItems: NavItem[] = [
  { label: "Overview", href: "/admin-dashboard", icon: FiHome },
  { label: "Applications", href: "/admin-dashboard/applications", icon: FiFileText },
  { label: "Users", href: "/admin-dashboard/users", icon: FiUsers },
  { label: "Schedules", href: "/admin-dashboard/schedules", icon: FiCalendar },
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

function SidebarSectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-5 text-[11px] font-semibold tracking-[0.08em] text-[#9ca3af]">
      {children}
    </p>
  );
}

function SidebarLink({
  item,
  collapsed,
  active,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noreferrer" : undefined}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-medium transition ${
        active ? "bg-[#fde9ea] text-[#ef242a]" : "text-[#1f2937] hover:bg-[#f5f6f8]"
      } active:scale-95`}
      aria-label={item.label}
      title={item.label}
    >
      <Icon className="h-5 w-5" />
      {!collapsed ? <span>{item.label}</span> : null}
    </Link>
  );
}

export function AdminShell({
  breadcrumbLabel = "Admin Dashboard",
  children,
}: {
  breadcrumbLabel?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
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
                  <SidebarLink
                    key={item.label}
                    item={item}
                    collapsed={sidebarCollapsed}
                    active={pathname === item.href}
                  />
                ))}
              </nav>
            </div>

            <div className="space-y-3">
              {!sidebarCollapsed ? <SidebarSectionLabel>SUPPORT</SidebarSectionLabel> : null}
              <nav className="space-y-1">
                {supportItems.map((item) => (
                  <SidebarLink
                    key={item.label}
                    item={item}
                    collapsed={sidebarCollapsed}
                    active={pathname === item.href}
                  />
                ))}
              </nav>
            </div>

            <div className="space-y-3">
              {!sidebarCollapsed ? <SidebarSectionLabel>CONNECT WITH US</SidebarSectionLabel> : null}
              <nav className="space-y-1">
                {socialItems.map((item) => (
                  <SidebarLink
                    key={item.label}
                    item={item}
                    collapsed={sidebarCollapsed}
                    active={false}
                  />
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
            <Link
              href="/admin-dashboard"
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-3 text-[18px] font-semibold shadow-[0_4px_14px_rgba(15,23,42,0.04)] transition-transform active:scale-95"
              aria-label="Admin Dashboard home"
            >
              <FiHome className="h-5 w-5 text-[#1f2937]" />
              <span>{breadcrumbLabel}</span>
            </Link>

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

          {children}
        </section>
      </div>
    </main>
  );
}
