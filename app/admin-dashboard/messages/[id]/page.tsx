import { AdminMessagesPage } from "@/components/admin/admin-messages-page";

export default async function AdminConversationRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminMessagesPage selectedConversationId={id} />;
}
