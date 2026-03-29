import { redirect } from "next/navigation";

export default async function ParentBookSessionIndexRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/parent-dashboard/find-tutors/${id}/book-session/student`);
}
