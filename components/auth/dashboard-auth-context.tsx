"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import { readBrowserCookie } from "@/lib/api/browser-api-client";

export type DashboardKind = "admin" | "student" | "tutor" | "parent";

export type DashboardAuthState = {
  dashboard: DashboardKind;
  role: string | null;
  tokenPresent: boolean;
  isAuthenticated: boolean;
};

type DashboardAuthContextValue = DashboardAuthState & {
  refreshSession: () => void;
};

const DashboardAuthContext = createContext<DashboardAuthContextValue | null>(null);

function readSessionFromCookies(dashboard: DashboardKind): DashboardAuthState {
  const role = readBrowserCookie("arch_user_role") || null;
  const tokenPresent = Boolean(readBrowserCookie("arch_access_token"));

  return {
    dashboard,
    role,
    tokenPresent,
    isAuthenticated: tokenPresent && role === dashboard,
  };
}

export function DashboardAuthProvider({
  dashboard,
  initialRole = null,
  initialTokenPresent = false,
  children,
}: {
  dashboard: DashboardKind;
  initialRole?: string | null;
  initialTokenPresent?: boolean;
  children: ReactNode;
}) {
  const [state, setState] = useState<DashboardAuthState>(() => ({
    dashboard,
    role: initialRole,
    tokenPresent: initialTokenPresent,
    isAuthenticated: initialTokenPresent && initialRole === dashboard,
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
