import {
  AdminFinancesPage,
  defaultAdminFinancesData,
  type AdminFinancesData,
} from "@/components/admin/admin-finances-page";
import { apiGet } from "@/lib/api/api-client";

async function fetchAdminFinances(): Promise<AdminFinancesData> {
  const payload = await apiGet<AdminFinancesData>("/admin-dashboard/finances");
  if (!payload || !Array.isArray(payload.transactions) || !payload.summary) {
    return defaultAdminFinancesData;
  }

  return {
    generated_at: payload.generated_at,
    summary: payload.summary,
    transactions: payload.transactions,
  };
}

export default async function AdminFinancesRoute() {
  let initialData = defaultAdminFinancesData;

  try {
    initialData = await fetchAdminFinances();
  } catch {
    // Keep the empty fallback if the backend is temporarily unavailable.
  }

  return <AdminFinancesPage initialData={initialData} />;
}
