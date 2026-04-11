import { redirect } from "next/navigation";

export default async function ParentBookSessionIndexRoute({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentParams = new URLSearchParams();
  Object.entries(resolvedSearchParams || {}).forEach(([key, value]) => {
    if (typeof value === "string" && value) currentParams.set(key, value);
  });
  const query = currentParams.toString();
  redirect(`/parent-dashboard/find-tutors/${id}/book-session/student${query ? `?${query}` : ""}`);
}
