"use client";

import { useMemo, useState } from "react";
import { FiDownload } from "react-icons/fi";

import { AdminShell } from "@/components/admin/admin-shell";

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

const transactions: TransactionRow[] = [
  {
    id: "TXN-8821",
    date: "Mar 20, 2026",
    description: "Algebra II — Marcus Reynolds / Jordan",
    payerRecipient: "Sarah Wilson (Parent)",
    type: "Payment",
    amount: "$45.00",
    platformFee: "$9.00",
    status: "Completed",
  },
  {
    id: "TXN-8820",
    date: "Mar 20, 2026",
    description: "Reading — Lisa Davis / Maya",
    payerRecipient: "Sarah Wilson (Parent)",
    type: "Payment",
    amount: "$30.00",
    platformFee: "$6.00",
    status: "Pending",
  },
  {
    id: "TXN-8819",
    date: "Mar 20, 2026",
    description: "SAT Prep — David Kim / Alex",
    payerRecipient: "Michael Thompson (Parent)",
    type: "Payment",
    amount: "$82.50",
    platformFee: "$16.50",
    status: "Completed",
  },
  {
    id: "TXN-8818",
    date: "Mar 19, 2026",
    description: "Weekly payout — Marcus Reynolds",
    payerRecipient: "Marcus Reynolds (Tutor)",
    type: "Payout",
    amount: "-$540.00",
    platformFee: "—",
    status: "Completed",
  },
  {
    id: "TXN-8817",
    date: "Mar 19, 2026",
    description: "Chemistry — Priya Patel / Sophie",
    payerRecipient: "James Lee (Parent)",
    type: "Payment",
    amount: "$50.00",
    platformFee: "$10.00",
    status: "Completed",
  },
  {
    id: "TXN-8816",
    date: "Mar 19, 2026",
    description: "Refund — Cancelled session #SS-2039",
    payerRecipient: "Patricia Johnson (Parent)",
    type: "Refund",
    amount: "-$45.00",
    platformFee: "—",
    status: "Completed",
  },
  {
    id: "TXN-8815",
    date: "Mar 18, 2026",
    description: "Weekly payout — Lisa Davis",
    payerRecipient: "Lisa Davis (Tutor)",
    type: "Payout",
    amount: "-$380.00",
    platformFee: "—",
    status: "Completed",
  },
  {
    id: "TXN-8814",
    date: "Mar 18, 2026",
    description: "Geometry — Marcus Reynolds / Ryan",
    payerRecipient: "Patricia Johnson (Parent)",
    type: "Payment",
    amount: "$40.00",
    platformFee: "$8.00",
    status: "Completed",
  },
  {
    id: "TXN-8813",
    date: "Mar 17, 2026",
    description: "Refund — Disputed session #SS-2029",
    payerRecipient: "Sarah Wilson (Parent)",
    type: "Refund",
    amount: "-$30.00",
    platformFee: "—",
    status: "Completed",
  },
];

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

export function AdminFinancesPage() {
  const [activeTab, setActiveTab] = useState<FinanceTab>("All Transactions");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRows = useMemo(() => {
    const type = mapTabToType(activeTab);
    return type ? transactions.filter((item) => item.type === type) : transactions;
  }, [activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pagedRows = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  const startIndex = filteredRows.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(safePage * pageSize, filteredRows.length);

  const handleTabChange = (tab: FinanceTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
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
          <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
              Total Revenue (MTD)
            </p>
            <p className="mt-2 text-[52px] font-bold leading-none text-[#239157]">$18,420</p>
            <p className="mt-1 text-[13px] font-semibold text-[#6b7280]">↑ 12% vs Feb 2026</p>
          </article>

          <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
              Tutor Payouts (MTD)
            </p>
            <p className="mt-2 text-[52px] font-bold leading-none text-[#20242b]">$14,730</p>
            <p className="mt-1 text-[13px] font-semibold text-[#6b7280]">80% of gross revenue</p>
          </article>

          <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
              Platform Fee (MTD)
            </p>
            <p className="mt-2 text-[52px] font-bold leading-none text-[#d71f45]">$3,690</p>
            <p className="mt-1 text-[13px] font-semibold text-[#6b7280]">20% of gross revenue</p>
          </article>

          <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
              Pending Payouts
            </p>
            <p className="mt-2 text-[52px] font-bold leading-none text-[#9c7a1e]">$4,320</p>
            <p className="mt-1 text-[13px] font-semibold text-[#6b7280]">18 tutors awaiting payout</p>
          </article>
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

              <div className="divide-y divide-[#eceef2]">
                {pagedRows.map((row) => (
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
                ))}
              </div>
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
