import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

import { readBrowserCookie, resolveBrowserApiBaseUrl } from "@/lib/api/browser-api-client";

export type SessionChatMessage = {
  id: string;
  sender: "student" | "tutor";
  message: string;
  timestamp: string;
  avatarUrl?: string;
  senderInitials?: string;
  clientMessageId?: string;
  attachmentName?: string;
  attachmentType?: string;
  attachmentSize?: number;
  pending?: boolean;
};

type SessionChatMessageInput = SessionChatMessage & {
  client_message_id?: string;
  avatar_url?: string;
  profile_image_url?: string;
  image_url?: string;
  photo_url?: string;
  sender_initials?: string;
  attachment_name?: string;
  attachment_type?: string;
  attachment_size?: number | string;
};

type SessionHistoryPayload = {
  booking_id?: string;
  messages?: SessionChatMessageInput[];
};

type SessionMessagePayload = SessionChatMessageInput & {
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

function normalizeMessage(message: SessionChatMessageInput): SessionChatMessage {
  const id = String(message.id || crypto.randomUUID());
  const clientMessageId = String(message.clientMessageId || message.client_message_id || "").trim() || undefined;
  const senderInitials = String(message.senderInitials || message.sender_initials || "").trim() || undefined;
  const avatarUrl =
    String(
      message.avatarUrl ||
        message.avatar_url ||
        message.profile_image_url ||
        message.image_url ||
        message.photo_url ||
        "",
    ).trim() || undefined;
  const attachmentName = String(message.attachmentName || message.attachment_name || "").trim() || undefined;
  const attachmentType = String(message.attachmentType || message.attachment_type || "").trim() || undefined;
  const attachmentSizeRaw = message.attachmentSize ?? message.attachment_size ?? 0;
  const attachmentSize = Number(attachmentSizeRaw) > 0 ? Number(attachmentSizeRaw) : undefined;
  return {
    id,
    sender: message.sender === "student" ? "student" : "tutor",
    message: String(message.message || ""),
    timestamp: formatTimestamp(message.timestamp),
    avatarUrl,
    senderInitials,
    clientMessageId: clientMessageId || id,
    attachmentName,
    attachmentType,
    attachmentSize,
    pending: Boolean(message.pending),
  };
}

function mergeMessages(existing: SessionChatMessage[], incoming: SessionChatMessage[]) {
  const map = new Map<string, SessionChatMessage>();
  const messageKey = (item: SessionChatMessage) => item.clientMessageId || item.id;
  for (const item of existing) {
    map.set(messageKey(item), item);
  }
  for (const item of incoming) {
    map.set(messageKey(item), item);
  }
  return Array.from(map.values());
}

export function useSessionChat({
  bookingId,
  initialMessages,
  senderRole,
  senderInitials,
  counterpartInitials,
  senderAvatarUrl,
  counterpartAvatarUrl,
}: {
  bookingId: string;
  initialMessages: SessionChatMessage[];
  senderRole: "student" | "tutor";
  senderInitials: string;
  counterpartInitials: string;
  senderAvatarUrl?: string;
  counterpartAvatarUrl?: string;
}) {
  const [messages, setMessages] = useState<SessionChatMessage[]>(() =>
    initialMessages.map((item) =>
      normalizeMessage({
        ...item,
        senderInitials: item.sender === senderRole ? senderInitials : counterpartInitials,
        avatarUrl: item.sender === senderRole ? senderAvatarUrl : counterpartAvatarUrl,
      }),
    ),
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
    setMessages(
      initialMessages.map((item) =>
        normalizeMessage({
          ...item,
          senderInitials: item.sender === senderRole ? senderInitials : counterpartInitials,
          avatarUrl: item.sender === senderRole ? senderAvatarUrl : counterpartAvatarUrl,
        }),
      ),
    );
  }, [
    bookingId,
    counterpartAvatarUrl,
    counterpartInitials,
    initialMessages,
    senderAvatarUrl,
    senderInitials,
    senderRole,
  ]);

  useEffect(() => {
    setMessages((current) =>
      current.map((item) => ({
        ...item,
        senderInitials: item.sender === senderRole ? senderInitials : counterpartInitials,
        avatarUrl: item.sender === senderRole ? senderAvatarUrl : counterpartAvatarUrl,
      })),
    );
  }, [counterpartInitials, counterpartAvatarUrl, senderAvatarUrl, senderInitials, senderRole]);

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
      const nextMessages = Array.isArray(payload.messages)
        ? payload.messages.map((item) =>
              normalizeMessage({
                ...item,
                senderInitials:
                  item.senderInitials ||
                  item.sender_initials ||
                  (item.sender === senderRole ? senderInitials : counterpartInitials),
                avatarUrl:
                  item.avatarUrl ||
                  item.avatar_url ||
                  item.profile_image_url ||
                  item.image_url ||
                  item.photo_url ||
                  (item.sender === senderRole ? senderAvatarUrl : counterpartAvatarUrl),
                clientMessageId: item.clientMessageId || item.client_message_id,
                attachmentName: item.attachmentName || item.attachment_name,
                attachmentType: item.attachmentType || item.attachment_type,
                attachmentSize:
                  Number(item.attachmentSize ?? item.attachment_size ?? 0) > 0
                    ? Number(item.attachmentSize ?? item.attachment_size ?? 0)
                    : undefined,
              }),
            )
        : [];
      setMessages(nextMessages);
      setLoading(false);
    });

    socket.on("session_message", (payload: SessionMessagePayload) => {
      if (String(payload.booking_id || bookingId) !== bookingId) return;
      setMessages((current) =>
        mergeMessages(current, [
          normalizeMessage({
            ...payload,
            senderInitials:
              payload.senderInitials ||
              payload.sender_initials ||
              (payload.sender === senderRole ? senderInitials : counterpartInitials),
            avatarUrl:
              payload.avatarUrl ||
              payload.avatar_url ||
              payload.profile_image_url ||
              payload.image_url ||
              payload.photo_url ||
              (payload.sender === senderRole ? senderAvatarUrl : counterpartAvatarUrl),
            clientMessageId: payload.clientMessageId || payload.client_message_id,
            attachmentName: payload.attachmentName || payload.attachment_name,
            attachmentType: payload.attachmentType || payload.attachment_type,
            attachmentSize:
              Number(payload.attachmentSize ?? payload.attachment_size ?? 0) > 0
                ? Number(payload.attachmentSize ?? payload.attachment_size ?? 0)
                : undefined,
          }),
        ]),
      );
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
  }, [bookingId, counterpartAvatarUrl, counterpartInitials, senderAvatarUrl, senderInitials, senderRole]);

  const sendMessage = useCallback(
    (message: string, attachment?: { name: string; type?: string; size?: number }) => {
      const socket = socketRef.current;
      const text = message.trim();
      const attachmentName = String(attachment?.name || "").trim();
      if (!socket || !socket.connected || (!text && !attachmentName)) {
        return false;
      }

      const messageId = crypto.randomUUID();
      const optimisticMessage = normalizeMessage({
        id: messageId,
        clientMessageId: messageId,
        sender: senderRole,
        message: text,
        timestamp: new Date().toISOString(),
        avatarUrl: senderAvatarUrl,
        senderInitials,
        attachmentName: attachmentName || undefined,
        attachmentType: String(attachment?.type || "").trim() || undefined,
        attachmentSize: Number(attachment?.size || 0) > 0 ? Number(attachment?.size || 0) : undefined,
        pending: true,
      });

      setMessages((current) => mergeMessages(current, [optimisticMessage]));
      socket.emit("send_session_message", {
        booking_id: bookingId,
        message: text,
        client_message_id: messageId,
        attachment_name: attachmentName || undefined,
        attachment_type: String(attachment?.type || "").trim() || undefined,
        attachment_size: Number(attachment?.size || 0) > 0 ? Number(attachment?.size || 0) : undefined,
      });
      window.dispatchEvent(new Event("arch-messages-updated"));
      return true;
    },
    [bookingId, senderAvatarUrl, senderInitials, senderRole],
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
