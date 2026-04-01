export type AdminProfileSettings = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  initials: string;
};

export type AdminProfileSettingsResponse = {
  profile: AdminProfileSettings;
  updated_by: string;
  last_modified_at: string;
};

export type AdminProfileSettingsUpdateRequest = {
  first_name: string;
  last_name: string;
  phone_number: string;
};

export type AdminPricingTierSettings = {
  tier: "Student" | "Tutor" | "Parent" | "Session";
  fee: string;
  body: string;
  features: string[];
  parent_fees?: string[] | null;
};

export type AdminPricingSettingsResponse = {
  tiers: AdminPricingTierSettings[];
  updated_by: string;
  last_modified_at: string;
};

export type AdminPricingSettingsUpdateRequest = {
  tiers: AdminPricingTierSettings[];
};

export type AdminPolicySection = {
  heading: string;
  body: string;
};

export type AdminPolicyPageSettings = {
  title: string;
  editor_content: string;
  display_sections: AdminPolicySection[];
};

export type AdminPolicyPageSettingsResponse = {
  page: AdminPolicyPageSettings;
  updated_by: string;
  last_modified_at: string;
};

export type AdminPolicyPageSettingsUpdateRequest = {
  page: AdminPolicyPageSettings;
};

export type AdminChangePasswordRequest = {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
};

export type AdminChangePasswordResponse = {
  message: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = typeof data?.detail === "string" ? data.detail : `Request failed (${response.status}).`;
    throw new Error(detail);
  }

  return data as T;
}

export function fetchAdminGeneralSettings() {
  return request<AdminProfileSettingsResponse>("/api/admin/settings/general");
}

export function updateAdminGeneralSettings(payload: AdminProfileSettingsUpdateRequest) {
  return request<AdminProfileSettingsResponse>("/api/admin/settings/general", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function fetchAdminPricingSettings() {
  return request<AdminPricingSettingsResponse>("/api/admin/settings/pricing-fees");
}

export function updateAdminPricingSettings(payload: AdminPricingSettingsUpdateRequest) {
  return request<AdminPricingSettingsResponse>("/api/admin/settings/pricing-fees", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function fetchAdminTermsSettings() {
  return request<AdminPolicyPageSettingsResponse>("/api/admin/settings/terms-conditions");
}

export function updateAdminTermsSettings(payload: AdminPolicyPageSettingsUpdateRequest) {
  return request<AdminPolicyPageSettingsResponse>("/api/admin/settings/terms-conditions", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function fetchAdminPrivacySettings() {
  return request<AdminPolicyPageSettingsResponse>("/api/admin/settings/privacy-policy");
}

export function updateAdminPrivacySettings(payload: AdminPolicyPageSettingsUpdateRequest) {
  return request<AdminPolicyPageSettingsResponse>("/api/admin/settings/privacy-policy", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function updateAdminPassword(payload: AdminChangePasswordRequest) {
  return request<AdminChangePasswordResponse>("/api/admin/settings/password", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
