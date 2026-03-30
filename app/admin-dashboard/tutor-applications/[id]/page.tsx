import { AdminTutorApplicationReviewPage } from "@/components/admin/admin-tutor-application-review-page";

export default async function AdminTutorApplicationReviewRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <AdminTutorApplicationReviewPage applicationId={id} />;
}
