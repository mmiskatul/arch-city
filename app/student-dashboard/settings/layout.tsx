"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { StudentSettingsSubrouteLayout } from "@/components/student/student-settings-subroute-layout";

const titles: Record<string, string> = {
  "/student-dashboard/settings/notification-preferences": "Notification Preferences",
  "/student-dashboard/settings/change-password": "Change Password",
  "/student-dashboard/settings/help-faqs": "Help & FAQ's",
};

export default function Layout({
  children,
}: {
  children: ReactNode;
  params: Promise<Record<string, never>>;
}) {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Settings";
  return <StudentSettingsSubrouteLayout title={title}>{children}</StudentSettingsSubrouteLayout>;
}
