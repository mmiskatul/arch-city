export const ADMIN_PREVIEW_ROLE_COOKIE = "arch_admin_preview_role";
export const ADMIN_PREVIEW_TARGET_COOKIE = "arch_admin_preview_target_id";

export type AdminPreviewRole = "student" | "parent" | "tutor";

export function isDashboardAccessibleForRole(
  dashboard: "admin" | "student" | "parent" | "tutor",
  role: string | null,
  previewRole: string | null,
) {
  if (role === dashboard) {
    return true;
  }

  return role === "admin" && previewRole === dashboard;
}

export function setAdminPreviewRoleCookie(role: AdminPreviewRole, targetId?: string) {
  if (typeof document === "undefined") return;

  const secureSuffix =
    typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ADMIN_PREVIEW_ROLE_COOKIE}=${encodeURIComponent(role)}; Path=/; Max-Age=${60 * 60 * 8}; SameSite=Lax${secureSuffix}`;
  if (targetId?.trim()) {
    document.cookie = `${ADMIN_PREVIEW_TARGET_COOKIE}=${encodeURIComponent(targetId.trim())}; Path=/; Max-Age=${60 * 60 * 8}; SameSite=Lax${secureSuffix}`;
  } else {
    document.cookie = `${ADMIN_PREVIEW_TARGET_COOKIE}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; SameSite=Lax`;
  }
  window.dispatchEvent(new Event("arch-session-updated"));
}

export function clearAdminPreviewRoleCookie() {
  if (typeof document === "undefined") return;

  document.cookie = `${ADMIN_PREVIEW_ROLE_COOKIE}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; SameSite=Lax`;
  document.cookie = `${ADMIN_PREVIEW_TARGET_COOKIE}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; SameSite=Lax`;
  window.dispatchEvent(new Event("arch-session-updated"));
}
