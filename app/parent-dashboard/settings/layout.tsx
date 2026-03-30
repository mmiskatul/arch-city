"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { ParentSettingsSubrouteLayout } from "@/components/parent/parent-settings-subroute-layout";

const titles: Record<string, string> = {
  "/parent-dashboard/settings/notification-preferences": "Notification Preferences",
  "/parent-dashboard/settings/change-password": "Change Password",
  "/parent-dashboard/settings/help-faqs": "Help & FAQ's",
};

export default function Layout({
  children,
}: {
  children: ReactNode;
  params: Promise<Record<string, never>>;
}) {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Settings";
  return <ParentSettingsSubrouteLayout title={title}>{children}</ParentSettingsSubrouteLayout>;
}
