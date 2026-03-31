"use client";

import { useEffect, useState } from "react";

import {
  fetchTutorApplicationStatus,
  type TutorApplicationStatus,
} from "@/lib/api/tutor-application-api";

function readCookie(name: string) {
  if (typeof document === "undefined") return "";
  const prefix = `${name}=`;
  const parts = document.cookie.split(";").map((part) => part.trim());
  const match = parts.find((part) => part.startsWith(prefix));
  return match ? decodeURIComponent(match.slice(prefix.length)) : "";
}

export function useTutorApplicationStatus() {
  const [status, setStatus] = useState<TutorApplicationStatus>("not_submitted");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadStatus() {
      const token = readCookie("arch_access_token");
      if (!token) {
        if (active) {
          setStatus("not_submitted");
          setLoading(false);
        }
        return;
      }

      try {
        const result = await fetchTutorApplicationStatus(token);
        if (active) setStatus(result);
      } catch {
        if (active) setStatus("not_submitted");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStatus();
    return () => {
      active = false;
    };
  }, []);

  const isApproved = status === "approved";
  const isNotApproved = !isApproved;

  return {
    status,
    loading,
    isApproved,
    isNotApproved,
  };
}
