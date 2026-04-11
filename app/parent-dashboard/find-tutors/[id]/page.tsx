import { notFound } from "next/navigation";

import { ParentTutorProfilePage } from "@/components/parent/parent-tutor-profile-page";
import { fetchAvailableParentTutorById } from "@/lib/api/public-tutors-api";
import { getParentTutorById } from "@/lib/parent/find-tutors-data";

export default async function ParentTutorProfileRoute({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const tutor = (await fetchAvailableParentTutorById(id).catch(() => null)) ?? getParentTutorById(id);

  if (!tutor) {
    notFound();
  }

  const currentParams = new URLSearchParams();
  Object.entries(resolvedSearchParams || {}).forEach(([key, value]) => {
    if (typeof value === "string" && value) currentParams.set(key, value);
  });
  const query = currentParams.toString();

  return (
    <ParentTutorProfilePage
      tutor={tutor}
      bookingForLabel={typeof resolvedSearchParams?.bookingForLabel === "string" ? resolvedSearchParams.bookingForLabel : "None selected"}
      backHref={query ? `/parent-dashboard/find-tutors?${query}` : "/parent-dashboard/find-tutors"}
      bookHref={query ? `/parent-dashboard/find-tutors/${id}/book-session?${query}` : `/parent-dashboard/find-tutors/${id}/book-session`}
    />
  );
}
