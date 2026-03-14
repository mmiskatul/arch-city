import { AdminShell } from "@/components/admin/admin-shell";
import { AdminUsersPage } from "@/components/admin/admin-users-page";
import { getUserList, getUserSources } from "@/lib/admin/users-data";

export default async function Page() {
  const [sources, users] = await Promise.all([getUserSources(), getUserList()]);

  return (
    <AdminShell breadcrumbLabel="Users">
      <AdminUsersPage sources={sources} users={users} />
    </AdminShell>
  );
}
