type PolicyPageKey = "terms-conditions" | "privacy-policy";

export type PolicySection = {
  heading: string;
  body: string;
};

export type PolicyPageResponse = {
  page: {
    title: string;
    editor_content: string;
    display_sections: PolicySection[];
  };
  updated_by: string;
  last_modified_at: string;
};

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function resolveApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url ? normalizeBaseUrl(url) : null;
}

export async function fetchPublicPolicyPage(page: PolicyPageKey): Promise<PolicyPageResponse> {
  const baseUrl = resolveApiBaseUrl();

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const response = await fetch(`${baseUrl}/public/settings/${page}`, {
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = typeof data?.detail === "string" ? data.detail : `Request failed (${response.status}).`;
    throw new Error(detail);
  }

  return data as PolicyPageResponse;
}
