export default function Page() {
  return (
    <div className="space-y-3">
      {[
        "How do I manage my students?",
        "How are monthly plan charges billed?",
        "How do I contact support?",
      ].map((question) => (
        <div key={question} className="rounded-lg border border-[#eceef2] bg-[#fafafb] px-4 py-3">
          <p className="text-[14px] font-semibold text-[#20242b]">{question}</p>
        </div>
      ))}
    </div>
  );
}
