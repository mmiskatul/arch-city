"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiDownload } from "react-icons/fi";

import { AdminShell } from "@/components/admin/admin-shell";
import { browserApiRequest, resolveBrowserApiBaseUrl } from "@/lib/api/browser-api-client";

type TransactionType = "Payment" | "Payout" | "Refund";
type TransactionStatus = "Completed" | "Pending";
type FinanceTab = "All Transactions" | "Payments" | "Payouts" | "Refunds";

type TransactionRow = {
  id: string;
  date: string;
  description: string;
  payerRecipient: string;
  type: TransactionType;
  amount: string;
  platformFee: string;
  status: TransactionStatus;
};

type FinanceSummary = {
  current_month_label: string;
  total_revenue_mtd: string;
  tutor_payouts_mtd: string;
  platform_fee_mtd: string;
  platform_fee_rate: string;
  pending_payouts_mtd: string;
  pending_tutors_count: number;
  payment_count: number;
  payout_count: number;
  refund_count: number;
};

type FinanceSummaryCard = {
  title: string;
  value: string;
  subtitle: string;
};

type FinanceChartPoint = {
  date: string;
  revenue: string;
  platform_fee: string;
  payouts: string;
  refunds: string;
};

export type AdminFinancesData = {
  generated_at?: string;
  summary: FinanceSummary;
  summary_cards?: FinanceSummaryCard[];
  transactions: TransactionRow[];
  rows?: TransactionRow[];
  chart_data?: FinanceChartPoint[];
};

export const defaultAdminFinancesData: AdminFinancesData = {
  summary: {
    current_month_label: "This month",
    total_revenue_mtd: "$0",
    tutor_payouts_mtd: "$0",
    platform_fee_mtd: "$0",
    platform_fee_rate: "$3",
    pending_payouts_mtd: "$0",
    pending_tutors_count: 0,
    payment_count: 0,
    payout_count: 0,
    refund_count: 0,
  },
  transactions: [],
  rows: [],
  summary_cards: [],
  chart_data: [],
};

const pageSize = 6;

function escapeCsvValue(value: string) {
  const safe = value.replace(/"/g, '""');
  return `"${safe}"`;
}

function typeClassName(type: TransactionType) {
  if (type === "Payment") return "bg-[#ebf7ef] text-[#239157]";
  if (type === "Payout") return "bg-[#ffecef] text-[#d94a62]";
  return "bg-[#fff6de] text-[#9c7a1e]";
}

function statusClassName(status: TransactionStatus) {
  if (status === "Completed") return "bg-[#ebf7ef] text-[#239157]";
  return "bg-[#fff6de] text-[#9c7a1e]";
}

function mapTabToType(tab: FinanceTab): TransactionType | null {
  if (tab === "Payments") return "Payment";
  if (tab === "Payouts") return "Payout";
  if (tab === "Refunds") return "Refund";
  return null;
}

function formatPercentage(numerator: string, denominator: string) {
  const num = Number(numerator.replace(/[^0-9.-]/g, ""));
  const den = Number(denominator.replace(/[^0-9.-]/g, ""));
  if (!Number.isFinite(num) || !Number.isFinite(den) || den <= 0) {
    return "0% of revenue";
  }

  return `${Math.round((num / den) * 100)}% of revenue`;
}

function TransactionsTableSkeleton() {
  return (
    <div className="divide-y divide-[#eceef2]">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[1fr_0.8fr_1.6fr_1.35fr_0.75fr_0.7fr_0.8fr_0.7fr] gap-3 px-4 py-3 text-[13px] text-[#4b5563] animate-pulse"
        >
          <div className="h-4 w-24 rounded bg-[#eceef2]" />
          <div className="h-4 w-20 rounded bg-[#eceef2]" />
          <div className="h-4 w-44 rounded bg-[#eceef2]" />
          <div className="h-4 w-36 rounded bg-[#eceef2]" />
          <div className="h-6 w-16 rounded-full bg-[#f1f3f6]" />
          <div className="h-4 w-16 rounded bg-[#eceef2]" />
          <div className="h-4 w-16 rounded bg-[#eceef2]" />
          <div className="h-6 w-16 rounded-full bg-[#f1f3f6]" />
        </div>
      ))}
    </div>
  );
}

export function AdminFinancesPage({
  initialData = defaultAdminFinancesData,
}: {
  initialData?: AdminFinancesData;
}) {
  const [data, setData] = useState<AdminFinancesData>(initialData);
  const [activeTab, setActiveTab] = useState<FinanceTab>("All Transactions");
  const [currentPage, setCurrentPage] = useState(1);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const loadingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadFinances = async () => {
      const baseUrl = resolveBrowserApiBaseUrl();
      if (!baseUrl) {
        return;
      }

      try {
        const payload = await browserApiRequest<AdminFinancesData>({
          url: `${baseUrl}/admin-dashboard/finances`,
          method: "GET",
        });

        if (!cancelled && payload && Array.isArray(payload.transactions)) {
          setData({
            generated_at: payload.generated_at,
            summary: payload.summary ?? defaultAdminFinancesData.summary,
            summary_cards: payload.summary_cards ?? defaultAdminFinancesData.summary_cards,
            transactions: payload.transactions,
            rows: payload.rows ?? payload.transactions,
            chart_data: payload.chart_data ?? defaultAdminFinancesData.chart_data,
          });
        }
      } catch {
        // Keep the server-rendered snapshot if the live refresh fails.
      } finally {
        if (!cancelled) {
          setIsTableLoading(false);
        }
      }
    };

    setIsTableLoading(true);
    loadFinances();

    return () => {
      cancelled = true;
      if (loadingTimeoutRef.current !== null) {
        window.clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  const filteredRows = useMemo(() => {
    const type = mapTabToType(activeTab);
    const sourceRows = data.rows ?? data.transactions;
    return type ? sourceRows.filter((item) => item.type === type) : sourceRows;
  }, [activeTab, data.rows, data.transactions]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pagedRows = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  const startIndex = filteredRows.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(safePage * pageSize, filteredRows.length);

  const totalRevenue = data.summary.total_revenue_mtd;
  const tutorPayouts = data.summary.tutor_payouts_mtd;
  const platformFee = data.summary.platform_fee_mtd;
  const platformFeeRate = data.summary.platform_fee_rate;
  const pendingPayouts = data.summary.pending_payouts_mtd;
  const summaryCards = data.summary_cards ?? [];

  const handleTabChange = (tab: FinanceTab) => {
    setIsTableLoading(true);
    setActiveTab(tab);
    setCurrentPage(1);
    if (loadingTimeoutRef.current !== null) {
      window.clearTimeout(loadingTimeoutRef.current);
    }
    loadingTimeoutRef.current = window.setTimeout(() => {
      setIsTableLoading(false);
      loadingTimeoutRef.current = null;
    }, 160);
  };

  const handleExportCsv = () => {
    const headers = [
      "Transaction ID",
      "Date",
      "Description",
      "Payer / Recipient",
      "Type",
      "Amount",
      "Platform Fee",
      "Status",
    ];

    const rows = filteredRows.map((item) => [
      `#${item.id}`,
      item.date,
      item.description,
      item.payerRecipient,
      item.type,
      item.amount,
      item.platformFee,
      item.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => escapeCsvValue(cell)).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filePrefix = activeTab.toLowerCase().replace(/\s+/g, "-");

    link.href = url;
    link.download = `finance-${filePrefix}-transactions.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AdminShell>
      <div className="w-full">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-[38px] font-bold leading-none text-[#20242b]">Finances</h1>

          <div className="flex items-center gap-2">
            <div className="h-10 w-[110px] rounded-xl border border-[#e5e7eb] bg-white" />
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-4 text-[13px] font-semibold text-[#4b5563]"
            >
              <FiDownload className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        <section className="mt-4 grid gap-3 lg:grid-cols-4">
          {(summaryCards.length > 0
            ? summaryCards
            : [
                {
                  title: "Total Revenue (MTD)",
                  value: totalRevenue,
                  subtitle: `Completed session revenue after refunds in ${data.summary.current_month_label}`,
                },
                {
                  title: "Tutor Payouts (MTD)",
                  value: tutorPayouts,
                  subtitle: formatPercentage(tutorPayouts, totalRevenue),
                },
                {
                  title: "Platform Fee (MTD)",
                  value: platformFee,
                  subtitle: `Current session fee rate: ${platformFeeRate} per session`,
                },
                {
                  title: "Pending Payouts",
                  value: pendingPayouts,
                  subtitle: `${data.summary.pending_tutors_count} tutors awaiting payout`,
                },
              ]
          ).map((card) => {
            const title = card.title;
            const value = card.value;
            const subtitle = card.subtitle;
            const valueClassName =
              title === "Total Revenue (MTD)"
                ? "text-[#239157]"
                : title === "Platform Fee (MTD)"
                  ? "text-[#d71f45]"
                  : title === "Pending Payouts"
                    ? "text-[#9c7a1e]"
                    : "text-[#20242b]";

            return (
              <article key={title} className="rounded-[14px] border border-[#e7e7eb] bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">{title}</p>
                <p className={`mt-2 text-[52px] font-bold leading-none ${valueClassName}`}>{value}</p>
                <p className="mt-1 text-[13px] font-semibold text-[#6b7280]">{subtitle}</p>
              </article>
            );
          })}
        </section>

        <div className="mt-4 flex items-center gap-4 border-b border-[#eceef2] bg-white px-2">
          {(["All Transactions", "Payments", "Payouts", "Refunds"] as const).map((tab) => {
            const active = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabChange(tab)}
                className={`inline-flex h-10 items-center border-b-2 px-2 text-[14px] font-semibold transition ${
                  active
                    ? "border-[#d94a62] text-[#d61c3f]"
                    : "border-transparent text-[#6b7280] hover:text-[#374151]"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <section className="mt-4 overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="overflow-x-auto">
            <div className="min-w-[1120px]">
              <div className="grid grid-cols-[1fr_0.8fr_1.6fr_1.35fr_0.75fr_0.7fr_0.8fr_0.7fr] gap-3 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
                <span>Transaction ID</span>
                <span>Date</span>
                <span>Description</span>
                <span>Payer / Recipient</span>
                <span>Type</span>
                <span>Amount</span>
                <span>Platform Fee</span>
                <span>Status</span>
              </div>

              {isTableLoading ? (
                <TransactionsTableSkeleton />
              ) : (
                <div className="divide-y divide-[#eceef2]">
                  {pagedRows.length === 0 ? (
                    <div className="px-4 py-8 text-center text-[13px] text-[#6b7280]">
                      No transactions found for the selected filter.
                    </div>
                  ) : (
                    pagedRows.map((row) => (
                      <div
                        key={row.id}
                        className="grid grid-cols-[1fr_0.8fr_1.6fr_1.35fr_0.75fr_0.7fr_0.8fr_0.7fr] gap-3 px-4 py-3 text-[13px] text-[#4b5563]"
                      >
                        <span className="font-semibold text-[#9ca3af]">#{row.id}</span>
                        <span>{row.date}</span>
                        <span>{row.description}</span>
                        <span>{row.payerRecipient}</span>
                        <div>
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${typeClassName(row.type)}`}>
                            {row.type}
                          </span>
                        </div>
                        <span className={`font-semibold ${row.amount.startsWith("-") ? "text-[#9c7a1e]" : "text-[#20242b]"}`}>
                          {row.amount}
                        </span>
                        <span className="font-semibold text-[#d94a62]">{row.platformFee}</span>
                        <div>
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClassName(row.status)}`}>
                            {row.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="mt-3 flex flex-col gap-3 text-[13px] text-[#6b7280] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {startIndex}-{endIndex} of {filteredRows.length} transactions this month
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={safePage === 1}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#e5e7eb] bg-white text-[#6b7280] disabled:cursor-not-allowed disabled:opacity-40"
            >
              &#8249;
            </button>
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              const active = safePage === pageNumber;
              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-md border text-[12px] font-semibold ${
                    active
                      ? "border-[#e24961] bg-[#ffecef] text-[#d61c3f]"
                      : "border-[#e5e7eb] bg-white text-[#6b7280]"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={safePage === totalPages}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#e5e7eb] bg-white text-[#6b7280] disabled:cursor-not-allowed disabled:opacity-40"
            >
              &#8250;
            </button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
