"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import { readBrowserCookie } from "@/lib/api/browser-api-client";
import { ADMIN_PREVIEW_ROLE_COOKIE, ADMIN_PREVIEW_TARGET_COOKIE } from "@/lib/admin-preview";

export type DashboardKind = "admin" | "student" | "tutor" | "parent";

export type DashboardAuthState = {
  dashboard: DashboardKind;
  role: string | null;
  previewRole: string | null;
  previewTargetId: string | null;
  tokenPresent: boolean;
  isAuthenticated: boolean;
  isPreviewSession: boolean;
};

type DashboardAuthContextValue = DashboardAuthState & {
  refreshSession: () => void;
};

const DashboardAuthContext = createContext<DashboardAuthContextValue | null>(null);

function readSessionFromCookies(dashboard: DashboardKind): DashboardAuthState {
  const role = readBrowserCookie("arch_user_role") || null;
  const previewRole = readBrowserCookie(ADMIN_PREVIEW_ROLE_COOKIE) || null;
  const previewTargetId = readBrowserCookie(ADMIN_PREVIEW_TARGET_COOKIE) || null;
  const tokenPresent = Boolean(readBrowserCookie("arch_access_token"));
  const isPreviewSession = tokenPresent && role === "admin" && previewRole === dashboard;

  return {
    dashboard,
    role,
    previewRole,
    previewTargetId,
    tokenPresent,
    isAuthenticated: tokenPresent && (role === dashboard || isPreviewSession),
    isPreviewSession,
  };
}

export function DashboardAuthProvider({
  dashboard,
  initialRole = null,
  initialPreviewRole = null,
  initialPreviewTargetId = null,
  initialTokenPresent = false,
  children,
}: {
  dashboard: DashboardKind;
  initialRole?: string | null;
  initialPreviewRole?: string | null;
  initialPreviewTargetId?: string | null;
  initialTokenPresent?: boolean;
  children: ReactNode;
}) {
  const [state, setState] = useState<DashboardAuthState>(() => ({
    dashboard,
    role: initialRole,
    previewRole: initialPreviewRole,
    previewTargetId: initialPreviewTargetId,
    tokenPresent: initialTokenPresent,
    isAuthenticated:
      initialTokenPresent &&
      (initialRole === dashboard || (initialRole === "admin" && initialPreviewRole === dashboard)),
    isPreviewSession:
      initialTokenPresent && initialRole === "admin" && initialPreviewRole === dashboard,
  }));

  const refreshSession = useCallback(() => {
    setState(readSessionFromCookies(dashboard));
  }, [dashboard]);

  useEffect(() => {
    function onSessionChanged() {
      refreshSession();
    }

    const intervalId = window.setInterval(onSessionChanged, 2000);

    window.addEventListener("arch-session-updated", onSessionChanged);
    window.addEventListener("focus", onSessionChanged);
    window.addEventListener("pageshow", onSessionChanged);
    window.addEventListener("storage", onSessionChanged);
    document.addEventListener("visibilitychange", onSessionChanged);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("arch-session-updated", onSessionChanged);
      window.removeEventListener("focus", onSessionChanged);
      window.removeEventListener("pageshow", onSessionChanged);
      window.removeEventListener("storage", onSessionChanged);
      document.removeEventListener("visibilitychange", onSessionChanged);
    };
  }, [refreshSession]);

  return (
    <DashboardAuthContext.Provider
      value={{
        ...state,
        refreshSession,
      }}
    >
      {children}
    </DashboardAuthContext.Provider>
  );
}

export function useDashboardAuth() {
  const context = useContext(DashboardAuthContext);
  if (!context) {
    throw new Error("useDashboardAuth must be used within a DashboardAuthProvider.");
  }

  return context;
}
