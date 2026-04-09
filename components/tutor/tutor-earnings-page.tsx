"use client";

import { useEffect, useMemo, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";

import { TutorShell } from "@/components/tutor/tutor-shell";
import { getTutorEarnings, type TutorEarningRow, type TutorEarningsResponse } from "@/lib/api/tutor-earnings-api";
import { useTutorApplicationStatus } from "@/lib/tutor/use-tutor-application-status";

type SummaryCard = {
  title: string;
  value: string;
  subtitle: string;
  icon: IconType;
  iconClassName: string;
  valueClassName?: string;
};

function SummaryCardView({ card }: { card: SummaryCard }) {
  const Icon = card.icon;

  return (
    <article className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6b7280]">
            {card.title}
          </p>
          <p className={`mt-3 text-[22px] font-bold text-[#20242b] ${card.valueClassName ?? ""}`}>
            {card.value}
          </p>
          <p className="mt-1 text-[13px] text-[#6b7280]">{card.subtitle}</p>
        </div>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.iconClassName}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
    </article>
  );
}

function typeClass(type: TutorEarningRow["type"]) {
  return type === "Virtual"
    ? "bg-[#ffecef] text-[#d94a62]"
    : "bg-[#f1f1f1] text-[#6b7280]";
}

function statusClass(status: TutorEarningRow["status"]) {
  return status === "Paid"
    ? "bg-[#e2f5ea] text-[#41a16f]"
    : "bg-[#fff6de] text-[#b58112]";
}

export function TutorEarningsPage() {
  const { isBlocked: isPending } = useTutorApplicationStatus();
  const [data, setData] = useState<TutorEarningsResponse | null>(null);
  const [loading, setLoading] = useState(!isPending);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadEarnings() {
      if (isPending) {
        setData(null);
        setLoading(false);
        setError("");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const payload = await getTutorEarnings();
        if (cancelled) return;
        setData(payload);
      } catch {
        if (!cancelled) {
          setData(null);
          setError("Unable to load earnings.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadEarnings();

    return () => {
      cancelled = true;
    };
  }, [isPending]);

  const summary = data?.summary;
  const rows = data?.items ?? [];

  const summaryCards: SummaryCard[] = useMemo(() => {
    if (isPending) {
      return [
        {
          title: "This Month",
          value: "$0",
          subtitle: "No earnings yet",
          icon: FiDollarSign,
          iconClassName: "bg-[#ffecef] text-[#d94a62]",
          valueClassName: "text-[#d61c3f]",
        },
        {
          title: "Sessions Completed",
          value: "0",
          subtitle: "This month",
          icon: FiCheckCircle,
          iconClassName: "bg-[#ebf7ef] text-[#1b8a5a]",
          valueClassName: "text-[#1b8a5a]",
        },
        {
          title: "All-Time Total",
          value: "$0",
          subtitle: "0 sessions completed",
          icon: FiTrendingUp,
          iconClassName: "bg-[#fff6de] text-[#b58112]",
        },
      ];
    }

    return [
      {
        title: "This Month",
        value: summary?.this_month_total ?? "$0",
        subtitle: summary?.current_month_label ?? "This month",
        icon: FiDollarSign,
        iconClassName: "bg-[#ffecef] text-[#d94a62]",
        valueClassName: "text-[#d61c3f]",
      },
      {
        title: "Sessions Completed",
        value: String(summary?.sessions_completed_this_month ?? 0),
        subtitle: "This month",
        icon: FiCheckCircle,
        iconClassName: "bg-[#ebf7ef] text-[#1b8a5a]",
        valueClassName: "text-[#1b8a5a]",
      },
      {
        title: "All-Time Total",
        value: summary?.all_time_total ?? "$0",
        subtitle: `${summary?.all_time_sessions ?? 0} sessions completed`,
        icon: FiTrendingUp,
        iconClassName: "bg-[#fff6de] text-[#b58112]",
      },
    ];
  }, [isPending, summary]);

  return (
    <TutorShell>
      <div className="w-full">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Earnings</h1>

          <div className="flex items-center gap-3 text-[14px] text-[#6b7280]">
            <div className="h-8 min-w-[128px] rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-3 text-[13px] leading-8 text-[#6b7280]">
              {summary?.current_month_label ?? "Current month"}
            </div>
          </div>
        </div>

        <section className="mt-5 grid gap-3 lg:grid-cols-3">
          {summaryCards.map((card) => (
            <SummaryCardView key={card.title} card={card} />
          ))}
        </section>

        <div className="mt-4 flex items-start gap-3 rounded-[12px] border border-[#f1c6cf] bg-[#fff8f9] px-4 py-3 text-[13px] text-[#6b7280]">
          <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#6b7280]" />
          <p>
            Earnings are collected directly from students via cash, check, Venmo, or PayPal after each session. This log is a record of expected and confirmed payments - it is not processed through this platform.
          </p>
        </div>

        <section className="mt-5">
          <h2 className="text-[17px] font-bold text-[#20242b]">
            Session Earnings - {summary?.current_month_label ?? "Current month"}
          </h2>

          <div className="mt-3 overflow-hidden rounded-[12px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_0.8fr_0.8fr_0.7fr_0.7fr] gap-4 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
              <span>Student</span>
              <span>Date</span>
              <span>Subject</span>
              <span>Duration</span>
              <span>Type</span>
              <span>Rate</span>
              <span>Status</span>
            </div>

            <div className="divide-y divide-[#eceef2]">
              {loading ? (
                <div className="px-4 py-8 text-center text-[14px] text-[#6b7280]">Loading earnings...</div>
              ) : null}
              {!loading && error ? (
                <div className="px-4 py-8 text-center text-[14px] text-[#b4233b]">{error}</div>
              ) : null}
              {!loading && !error && rows.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[1.5fr_1fr_1fr_0.8fr_0.8fr_0.7fr_0.7fr] gap-4 px-4 py-4 text-[14px] text-[#4b5563]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ffe7eb] text-[10px] font-bold text-[#d94a62]">
                      {row.student_initials}
                    </span>
                    <span className="font-medium text-[#4b5563]">{row.student_name}</span>
                  </div>
                  <div>{row.date}</div>
                  <div>{row.subject}</div>
                  <div>{row.duration}</div>
                  <div>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${typeClass(row.type)}`}>
                      {row.type}
                    </span>
                  </div>
                  <div className={`font-semibold ${row.status === "Paid" ? "text-[#1b8a5a]" : "text-[#8f6a16]"}`}>
                    {row.rate}
                  </div>
                  <div>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusClass(row.status)}`}>
                      {row.status}
                    </span>
                  </div>
                </div>
              ))}

              {!loading && !error && rows.length === 0 ? (
                <div className="px-4 py-8 text-center text-[14px] text-[#6b7280]">
                  No completed earnings found for this month.
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </TutorShell>
  );
}



