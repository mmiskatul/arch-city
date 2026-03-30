import { redirect } from "next/navigation";

export default function ParentSettingsRoute() {
  redirect("/parent-dashboard/settings/notification-preferences");
}
