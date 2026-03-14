import { AdminApplicationDetailPage } from "@/components/admin/admin-application-detail-page";
import { getApplicationDetail } from "@/lib/admin/application-data";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = await getApplicationDetail(id);

  return <AdminApplicationDetailPage application={application} />;
}
