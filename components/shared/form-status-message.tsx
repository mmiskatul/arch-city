type FormStatusMessageProps = {
  type: "idle" | "success" | "error";
  message: string;
};

export function FormStatusMessage({
  type,
  message,
}: FormStatusMessageProps) {
  if (!message || type === "idle") {
    return null;
  }

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm font-medium ${
        type === "success"
          ? "border-[#8ddb9e] bg-[#ecf9f0] text-[#257942]"
          : "border-[#ef7a80] bg-[#fff5f5] text-[#b42318]"
      }`}
    >
      {message}
    </div>
  );
}
