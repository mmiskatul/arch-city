"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { TutorSettingsSubrouteLayout } from "@/components/tutor/tutor-settings-subroute-layout";

const titles: Record<string, string> = {
  "/tutor-dashboard/settings/notification-preferences": "Notification Preferences",
  "/tutor-dashboard/settings/change-password": "Change Password",
  "/tutor-dashboard/settings/help-faqs": "Help & FAQ's",
};

export default function Layout({
  children,
}: {
  children: ReactNode;
  params: Promise<Record<string, never>>;
}) {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Settings";
  return <TutorSettingsSubrouteLayout title={title}>{children}</TutorSettingsSubrouteLayout>;
}
