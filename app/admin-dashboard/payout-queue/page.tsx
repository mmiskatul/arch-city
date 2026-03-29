import { AdminSectionPage } from "@/components/admin/admin-section-page";

export default function AdminPayoutQueueRoute() {
  return (
    <AdminSectionPage
      title="Payout Queue"
      description="Track upcoming tutor payouts, verify completed sessions, and release payment batches after reconciliation checks."
    />
  );
}
