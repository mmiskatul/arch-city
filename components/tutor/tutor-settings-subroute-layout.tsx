"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { TutorShell } from "@/components/tutor/tutor-shell";

const subRoutes = [
  {
    label: "Notification Preferences",
    href: "/tutor-dashboard/settings/notification-preferences",
  },
  {
    label: "Change Password",
    href: "/tutor-dashboard/settings/change-password",
  },
  {
    label: "Help & FAQ's",
    href: "/tutor-dashboard/settings/help-faqs",
  },
];

export function TutorSettingsSubrouteLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <TutorShell>
      <div className="w-full space-y-4">
        <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Settings</h1>

        <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex flex-wrap items-center gap-2">
            {subRoutes.map((route) => {
              const isActive = pathname === route.href;
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`inline-flex h-9 items-center rounded-full px-4 text-[13px] font-semibold transition ${
                    isActive
                      ? "bg-[#d61c3f] text-white"
                      : "bg-[#f4f5f7] text-[#4b5563] hover:bg-[#eceef2]"
                  }`}
                >
                  {route.label}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h2 className="text-[18px] font-bold text-[#20242b]">{title}</h2>
          <div className="mt-4">{children}</div>
        </section>
      </div>
    </TutorShell>
  );
}
