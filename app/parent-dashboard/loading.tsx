import { ParentShell } from "@/components/parent/parent-shell";

export default function Loading() {
  return (
    <ParentShell>
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-full border border-[#eceef2] bg-white px-4 py-3 shadow-sm">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#d61c3f] border-t-transparent" aria-hidden="true" />
          <span className="text-sm font-medium text-[#4b5563]">Loading section...</span>
        </div>
      </div>
    </ParentShell>
  );
}
