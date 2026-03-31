import { AdminTutorApplicationsPage } from "@/components/admin/admin-tutor-applications-page";

export default async function AdminTutorApplicationsRoute({
  searchParams,
}: {
  searchParams?: Promise<{ view?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const activeView: "pending" | "all" = params.view === "all" ? "all" : "pending";

  return <AdminTutorApplicationsPage activeView={activeView} />;
}
