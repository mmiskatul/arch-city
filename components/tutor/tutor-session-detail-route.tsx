"use client";

import { useEffect, useState } from "react";

import { fetchTutorScheduleItemByIdClient } from "@/lib/api/tutor-schedule-browser-api";
import { TutorSessionDetailPage } from "@/components/tutor/tutor-session-detail-page";
import type { TutorScheduleItem } from "@/lib/tutor/schedule-data";

function SessionDetailSkeleton() {
  return (
    <div className="w-full">
      <div className="grid gap-0 rounded-[12px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] xl:grid-cols-[310px_minmax(0,1fr)]">
        <aside className="border-b border-[#eceef2] p-4 xl:border-r xl:border-b-0">
          <div className="h-3.5 w-32 rounded bg-[#eef1f4] animate-pulse" />
          <div className="mt-8 flex items-start gap-4 border-b border-[#eceef2] pb-4">
            <div className="h-12 w-12 rounded-full bg-[#eef1f4] animate-pulse" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-48 rounded bg-[#eef1f4] animate-pulse" />
              <div className="h-4 w-36 rounded bg-[#eef1f4] animate-pulse" />
              <div className="h-6 w-20 rounded-full bg-[#eef1f4] animate-pulse" />
            </div>
          </div>

          <div className="space-y-4 py-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`detail-skeleton-left-${index}`} className="flex items-start gap-3">
                <div className="h-4 w-4 rounded bg-[#eef1f4] animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-16 rounded bg-[#eef1f4] animate-pulse" />
                  <div className="h-4 w-40 rounded bg-[#eef1f4] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section className="min-w-0 p-4">
          <div className="h-10 rounded bg-[#eef1f4] animate-pulse" />
          <div className="mt-4 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`detail-skeleton-message-${index}`} className="h-16 rounded-[18px] bg-[#eef1f4] animate-pulse" />
            ))}
          </div>
          <div className="mt-4 h-14 rounded-full bg-[#eef1f4] animate-pulse" />
        </section>
      </div>
    </div>
  );
}

export function TutorSessionDetailRoute({ id }: { id: string }) {
  const [session, setSession] = useState<TutorScheduleItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const data = await fetchTutorScheduleItemByIdClient(id);
      if (!active) return;
      setSession(data);
      setLoading(false);
    }

    void loadSession();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <SessionDetailSkeleton />;
  }

  if (!session) {
    return (
      <div className="rounded-[12px] border border-[#f3c2c9] bg-[#fff5f7] px-4 py-3 text-[14px] text-[#b4233b]">
        Session not found.
      </div>
    );
  }

  return <TutorSessionDetailPage session={session} />;
}
