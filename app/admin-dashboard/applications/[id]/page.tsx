import { AdminApplicationDetailPage } from "@/components/admin/admin-application-detail-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <AdminApplicationDetailPage applicationId={id} />;
}
