import { AdminApplicationsPage } from "@/components/admin/admin-applications-page";
import { getApplicationRows } from "@/lib/admin/application-data";

export default async function Page() {
  const applicationRows = await getApplicationRows();

  return <AdminApplicationsPage applicationRows={applicationRows} />;
}
