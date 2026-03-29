import { notFound } from "next/navigation";

import { AdminMessagesPage } from "@/components/admin/admin-messages-page";
import { getAdminConversationById } from "@/lib/admin/messages-data";

export default async function AdminConversationRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conversation = getAdminConversationById(id);

  if (!conversation) {
    notFound();
  }

  return <AdminMessagesPage selectedConversationId={id} />;
}
