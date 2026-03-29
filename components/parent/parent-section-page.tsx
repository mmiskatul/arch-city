import { ParentShell } from "@/components/parent/parent-shell";

type ParentSectionPageProps = {
  title: string;
  description: string;
};

export function ParentSectionPage({ title, description }: ParentSectionPageProps) {
  return (
    <ParentShell>
      <div className="w-full">
        <div className="rounded-[16px] border border-[#e7e7eb] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h1 className="text-[20px] font-bold text-[#20242b]">{title}</h1>
          <p className="mt-2 max-w-[720px] text-[14px] leading-6 text-[#6b7280]">{description}</p>
        </div>
      </div>
    </ParentShell>
  );
}
