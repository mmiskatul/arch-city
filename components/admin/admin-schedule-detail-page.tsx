import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import type { AdminScheduleDetail } from "@/lib/admin/schedules-data";
import { ADMIN_SCHEDULES_ROUTE } from "@/lib/routes";

function statusClassName(status: "Upcoming" | "Completed" | "Cancelled") {
  if (status === "Completed") return "bg-[#ebf7ef] text-[#239157]";
  if (status === "Upcoming") return "bg-[#fff6de] text-[#9c7a1e]";
  return "bg-[#ffecef] text-[#d94a62]";
}

export function AdminScheduleDetailPage({ session }: { session: AdminScheduleDetail }) {
  return (
    <AdminShell>
      <div className="w-full">
        <Link
          href={ADMIN_SCHEDULES_ROUTE}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6b7280]"
        >
          ← Back to Schedules
        </Link>

        <div className="mt-3">
          <h1 className="text-[40px] font-bold leading-none text-[#20242b]">
            Session #{session.sessionId}
            <span className={`ml-2 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusClassName(session.status)}`}>
              {session.status}
            </span>
          </h1>
          <p className="mt-1 text-[13px] text-[#6b7280]">
            {session.subject} · {session.dateLabel} · {session.timeRange} · {session.sessionType}
          </p>
        </div>

        <section className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)]">
          <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
              Session Overview
            </h2>
            <div className="mt-3 grid gap-3 text-[13px] text-[#4b5563] sm:grid-cols-2">
              <p>
                <span className="text-[#6b7280]">Session ID</span>
                <br />
                <span className="font-semibold text-[#20242b]">#{session.sessionId}</span>
              </p>
              <p>
                <span className="text-[#6b7280]">Subject</span>
                <br />
                <span className="font-semibold text-[#20242b]">{session.subject}</span>
              </p>
              <p>
                <span className="text-[#6b7280]">Date</span>
                <br />
                {session.overview.date}
              </p>
              <p>
                <span className="text-[#6b7280]">Time</span>
                <br />
                {session.timeRange.replace("-", " - ")}
              </p>
              <p>
                <span className="text-[#6b7280]">Duration</span>
                <br />
                {session.overview.duration}
              </p>
              <p>
                <span className="text-[#6b7280]">Session Type</span>
                <br />
                <span className="inline-flex rounded-full bg-[#ffecef] px-2 py-0.5 text-[10px] font-semibold text-[#d94a62]">
                  {session.sessionType}
                </span>
              </p>
              <p>
                <span className="text-[#6b7280]">Status</span>
                <br />
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusClassName(session.status)}`}>
                  {session.status}
                </span>
              </p>
              <p>
                <span className="text-[#6b7280]">Platform</span>
                <br />
                {session.overview.platform}
              </p>
            </div>
          </article>

          <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
              Payment & Fee
            </h2>
            <div className="mt-3 space-y-1 text-[13px]">
              <div className="flex items-center justify-between text-[#6b7280]">
                <span>Session rate</span>
                <span>{session.payment.sessionRate}</span>
              </div>
              <div className="flex items-center justify-between text-[#6b7280]">
                <span>Duration</span>
                <span>{session.payment.durationHours}</span>
              </div>
              <div className="flex items-center justify-between text-[#6b7280]">
                <span>Subtotal</span>
                <span>{session.payment.subtotal}</span>
              </div>
              <div className="flex items-center justify-between text-[#6b7280]">
                <span>Platform fee (10%)</span>
                <span className="font-semibold text-[#d94a62]">{session.payment.platformFee}</span>
              </div>
              <div className="mt-2 border-t border-[#eceef2] pt-2">
                <div className="flex items-center justify-between text-[18px] font-bold text-[#20242b]">
                  <span>Total charged</span>
                  <span>{session.payment.totalCharged}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[14px] font-semibold text-[#239157]">
                  <span>Tutor payout</span>
                  <span>{session.payment.tutorPayout}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 border-t border-[#eceef2] pt-3 text-[12px] text-[#6b7280]">
              <p>
                Payment method
                <br />
                <span className="font-semibold text-[#20242b]">{session.payment.method}</span>
              </p>
              <p className="mt-1">{session.payment.paidAt}</p>
              <span className="mt-1 inline-flex rounded-full bg-[#ebf7ef] px-2 py-0.5 text-[10px] font-semibold text-[#239157]">
                Paid
              </span>
            </div>
          </article>
        </section>

        <section className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)]">
          <div className="space-y-3">
            <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">Student</h2>
              <div className="mt-3 rounded-xl border border-[#eceef2] bg-[#fafafb] px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ${session.student.initialsClassName}`}
                    >
                      {session.student.initials}
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-[#20242b]">{session.student.name}</p>
                      <p className="text-[12px] text-[#6b7280]">{session.student.gradeSchool}</p>
                      <p className="text-[12px] text-[#6b7280]">{session.student.parentPhone}</p>
                    </div>
                  </div>
                  <Link href="#" className="text-[12px] font-semibold text-[#d61c3f]">
                    View Profile →
                  </Link>
                </div>
              </div>
              <div className="mt-3 grid gap-2 text-[13px] text-[#4b5563] sm:grid-cols-2">
                <p>
                  <span className="text-[#6b7280]">Email</span>
                  <br />
                  {session.student.email}
                </p>
                <p>
                  <span className="text-[#6b7280]">Current Plan</span>
                  <br />
                  {session.student.plan}
                </p>
                <p>
                  <span className="text-[#6b7280]">Sessions Used (MTM)</span>
                  <br />
                  {session.student.sessionsUsed}
                </p>
                <p>
                  <span className="text-[#6b7280]">Total Sessions</span>
                  <br />
                  {session.student.totalSessions}
                </p>
              </div>
            </article>

            <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">Tutor</h2>
              <div className="mt-3 rounded-xl border border-[#eceef2] bg-[#fafafb] px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ${session.tutor.initialsClassName}`}
                    >
                      {session.tutor.initials}
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-[#20242b]">{session.tutor.name}</p>
                      <p className="text-[12px] text-[#6b7280]">{session.tutor.title}</p>
                      <p className="text-[12px] font-semibold text-[#8f6b10]">{session.tutor.ratingAndSessions}</p>
                    </div>
                  </div>
                  <Link href="#" className="text-[12px] font-semibold text-[#d61c3f]">
                    View Profile →
                  </Link>
                </div>
              </div>
              <div className="mt-3 grid gap-2 text-[13px] text-[#4b5563] sm:grid-cols-2">
                <p>
                  <span className="text-[#6b7280]">Email</span>
                  <br />
                  {session.tutor.email}
                </p>
                <p>
                  <span className="text-[#6b7280]">Phone</span>
                  <br />
                  {session.tutor.phone}
                </p>
                <p>
                  <span className="text-[#6b7280]">Rate Applied</span>
                  <br />
                  {session.tutor.rateApplied}
                </p>
                <p>
                  <span className="text-[#6b7280]">Status</span>
                  <br />
                  <span className="inline-flex rounded-full bg-[#ebf7ef] px-2 py-0.5 text-[10px] font-semibold text-[#239157]">
                    {session.tutor.status}
                  </span>
                </p>
              </div>
            </article>

            <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">Session Notes</h2>
              <p className="mt-3 rounded-xl bg-[#fafafb] px-3 py-2.5 text-[13px] leading-7 text-[#4b5563]">
                {session.notes}
              </p>
              <p className="mt-2 text-[11px] text-[#9ca3af]">{session.notesMeta}</p>
            </article>
          </div>

          <div className="space-y-3">
            <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
                Session Timeline
              </h2>
              <div className="mt-4 space-y-3">
                {session.timeline.map((item, index) => (
                  <div key={`${item.title}-${index}`} className="relative pl-7">
                    <span className="absolute left-0 top-1 h-3.5 w-3.5 rounded-full bg-[#239157]" />
                    {index < session.timeline.length - 1 ? (
                      <span className="absolute left-[6px] top-5 h-[calc(100%-6px)] w-[2px] bg-[#d9dee5]" />
                    ) : null}
                    <div className="pb-1">
                      <p className="text-[13px] font-semibold text-[#20242b]">{item.title}</p>
                      <p className="text-[12px] text-[#6b7280]">{item.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">Admin Actions</h2>
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  className="inline-flex h-9 w-full items-center justify-center rounded-lg border border-[#e5e7eb] bg-white text-[13px] font-semibold text-[#374151]"
                >
                  Send Message to Tutor
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 w-full items-center justify-center rounded-lg border border-[#e5e7eb] bg-white text-[13px] font-semibold text-[#374151]"
                >
                  Send Message to Parent
                </button>
                <button
                  type="button"
                  className="inline-flex h-20 w-full items-center justify-center rounded-lg border border-[#f3b5c0] bg-[#ffecef] text-[14px] font-semibold text-[#d94a62]"
                >
                  Flag Session
                </button>
              </div>
            </article>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
