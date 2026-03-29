"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import {
  ADMIN_SETTINGS_PRICING_ROUTE,
  ADMIN_SETTINGS_PRIVACY_ROUTE,
  ADMIN_SETTINGS_ROUTE,
  ADMIN_SETTINGS_TERMS_ROUTE,
} from "@/lib/routes";

type SettingsLayoutProps = {
  title: string;
  subtitle: string;
  rightMeta?: string;
  children: ReactNode;
};

const settingsNavItems = [
  { label: "General", href: ADMIN_SETTINGS_ROUTE },
  { label: "Pricing & Fees", href: ADMIN_SETTINGS_PRICING_ROUTE },
  { label: "Terms & Conditions", href: ADMIN_SETTINGS_TERMS_ROUTE },
  { label: "Privacy & Policy", href: ADMIN_SETTINGS_PRIVACY_ROUTE },
];

export function AdminSettingsLayout({
  title,
  subtitle,
  rightMeta,
  children,
}: SettingsLayoutProps) {
  const pathname = usePathname();

  return (
    <AdminShell>
      <div className="w-full">
        <div className="grid gap-5 xl:grid-cols-[180px_minmax(0,1fr)]">
          <aside className="pt-2">
            <div className="space-y-1">
              {settingsNavItems.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`block w-full rounded-xl px-3 py-2 text-left text-[15px] font-medium transition ${
                      active
                        ? "bg-[#ffe9ec] text-[#d61c3f]"
                        : "text-[#4b5563] hover:bg-[#f7f7f8]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </aside>

          <section>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-[44px] font-bold leading-none text-[#20242b]">{title}</h1>
                <p className="mt-2 text-[22px] text-[#5b5b99]">{subtitle}</p>
              </div>
              {rightMeta ? <p className="text-[14px] text-[#9ca3af]">{rightMeta}</p> : null}
            </div>

            <div className="mt-4">{children}</div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
