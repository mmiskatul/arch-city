import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

import { readBrowserCookie, resolveBrowserApiBaseUrl } from "@/lib/api/browser-api-client";

export type SessionChatMessage = {
  id: string;
  sender: "student" | "tutor";
  message: string;
  timestamp: string;
};

type SessionHistoryPayload = {
  booking_id?: string;
  messages?: SessionChatMessage[];
};

type SessionMessagePayload = SessionChatMessage & {
  booking_id?: string;
};

function normalizeSocketBaseUrl() {
  const apiBaseUrl = resolveBrowserApiBaseUrl();
  if (!apiBaseUrl) return null;
  return apiBaseUrl.replace(/\/api\/v1\/?$/, "");
}

function formatTimestamp(value: string) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime()) || !raw.includes("T")) {
    return raw;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

function normalizeMessage(message: SessionChatMessage): SessionChatMessage {
  return {
    id: String(message.id || crypto.randomUUID()),
    sender: message.sender === "student" ? "student" : "tutor",
    message: String(message.message || ""),
    timestamp: formatTimestamp(message.timestamp),
  };
}

function mergeMessages(existing: SessionChatMessage[], incoming: SessionChatMessage[]) {
  const map = new Map<string, SessionChatMessage>();
  for (const item of existing) {
    map.set(item.id, item);
  }
  for (const item of incoming) {
    map.set(item.id, item);
  }
  return Array.from(map.values());
}

export function useSessionChat({
  bookingId,
  initialMessages,
}: {
  bookingId: string;
  initialMessages: SessionChatMessage[];
}) {
  const [messages, setMessages] = useState<SessionChatMessage[]>(() =>
    initialMessages.map(normalizeMessage),
  );
  const [draft, setDraft] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(() => {
    const token = readBrowserCookie("arch_access_token");
    return Boolean(bookingId && token && normalizeSocketBaseUrl());
  });
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = readBrowserCookie("arch_access_token");
    const socketBaseUrl = normalizeSocketBaseUrl();

    if (!bookingId || !token || !socketBaseUrl) {
      return;
    }

    const socket = io(socketBaseUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      autoConnect: true,
      withCredentials: false,
      auth: {
        token,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      setLoading(false);
      setError(null);
      socket.emit("join_session", { booking_id: bookingId });
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("connect_error", (event) => {
      setError(event.message || "Unable to connect to chat.");
      setLoading(false);
    });

    socket.on("session_history", (payload: SessionHistoryPayload) => {
      if (String(payload.booking_id || "") !== bookingId) return;
      const nextMessages = Array.isArray(payload.messages) ? payload.messages.map(normalizeMessage) : [];
      setMessages(nextMessages);
      setLoading(false);
    });

    socket.on("session_message", (payload: SessionMessagePayload) => {
      if (String(payload.booking_id || bookingId) !== bookingId) return;
      setMessages((current) => mergeMessages(current, [normalizeMessage(payload)]));
      window.dispatchEvent(new Event("arch-messages-updated"));
    });

    socket.on("session_error", (payload: { message?: string }) => {
      setError(payload.message || "Unable to update chat.");
      setLoading(false);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [bookingId]);

  const sendMessage = useCallback(
    (message: string) => {
      const socket = socketRef.current;
      const text = message.trim();
      if (!socket || !socket.connected || !text) {
        return false;
      }

      socket.emit("send_session_message", {
        booking_id: bookingId,
        message: text,
      });
      window.dispatchEvent(new Event("arch-messages-updated"));
      return true;
    },
    [bookingId],
  );

  const canSend = useMemo(() => connected && !loading, [connected, loading]);

  return {
    messages,
    draft,
    setDraft,
    sendMessage,
    connected,
    loading,
    error,
    canSend,
    clearError: () => setError(null),
  };
}
