import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";

import {
  readBrowserCookie,
  refreshBrowserSession,
  resolveBrowserApiBaseUrl,
} from "@/lib/api/browser-api-client";
import { NOTIFICATIONS_UPDATED_EVENT } from "@/lib/notifications-store";

function normalizeSocketBaseUrl() {
  const apiBaseUrl = resolveBrowserApiBaseUrl();
  if (!apiBaseUrl) return null;
  return apiBaseUrl.replace(/\/api\/v1\/?$/, "");
}

export function useNotificationsSocket(enabled: boolean) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let active = true;

    async function connectSocket() {
      const socketBaseUrl = normalizeSocketBaseUrl();
      if (!enabled || !socketBaseUrl) {
        return;
      }

      if (!readBrowserCookie("arch_access_token")) {
        const refreshed = await refreshBrowserSession();
        if (!refreshed || !active) {
          return;
        }
      }

      const token = readBrowserCookie("arch_access_token");
      if (!token || !active) {
        return;
      }

      const socket = io(socketBaseUrl, {
        path: "/socket.io",
        transports: ["websocket"],
        autoConnect: true,
        withCredentials: false,
        auth: { token },
      });

      socketRef.current = socket;

      socket.on("notifications_updated", (payload: unknown) => {
        window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED_EVENT, { detail: payload }));
      });

      socket.on("connect_error", async () => {
        const refreshed = await refreshBrowserSession();
        if (refreshed && active) {
          socket.disconnect();
          socket.connect();
        }
      });
    }

    void connectSocket();

    return () => {
      active = false;
      socketRef.current?.removeAllListeners();
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [enabled]);
}
