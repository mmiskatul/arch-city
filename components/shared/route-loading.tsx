export function RouteLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex min-h-[40vh] w-full items-center justify-center px-4 py-8">
      <div className="flex items-center gap-3 rounded-full border border-[#eceef2] bg-white px-4 py-3 shadow-sm">
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-[#d61c3f] border-t-transparent"
          aria-hidden="true"
        />
        <span className="text-sm font-medium text-[#4b5563]">{message}</span>
      </div>
    </div>
  );
}
