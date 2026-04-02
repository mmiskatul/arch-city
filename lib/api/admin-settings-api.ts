import { browserApiRequest } from "@/lib/api/browser-api-client";

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

async function request<T>(path: string, method: "GET" | "PUT", data?: unknown): Promise<T> {
  return browserApiRequest<T>({
    url: path,
    method,
    data,
  });
}

export function fetchAdminGeneralSettings() {
  return request<AdminProfileSettingsResponse>("/api/admin/settings/general", "GET");
}

export function updateAdminGeneralSettings(payload: AdminProfileSettingsUpdateRequest) {
  return request<AdminProfileSettingsResponse>("/api/admin/settings/general", "PUT", payload);
}

export function fetchAdminPricingSettings() {
  return request<AdminPricingSettingsResponse>("/api/admin/settings/pricing-fees", "GET");
}

export function updateAdminPricingSettings(payload: AdminPricingSettingsUpdateRequest) {
  return request<AdminPricingSettingsResponse>("/api/admin/settings/pricing-fees", "PUT", payload);
}

export function fetchAdminTermsSettings() {
  return request<AdminPolicyPageSettingsResponse>("/api/admin/settings/terms-conditions", "GET");
}

export function updateAdminTermsSettings(payload: AdminPolicyPageSettingsUpdateRequest) {
  return request<AdminPolicyPageSettingsResponse>("/api/admin/settings/terms-conditions", "PUT", payload);
}

export function fetchAdminPrivacySettings() {
  return request<AdminPolicyPageSettingsResponse>("/api/admin/settings/privacy-policy", "GET");
}

export function updateAdminPrivacySettings(payload: AdminPolicyPageSettingsUpdateRequest) {
  return request<AdminPolicyPageSettingsResponse>("/api/admin/settings/privacy-policy", "PUT", payload);
}

export function updateAdminPassword(payload: AdminChangePasswordRequest) {
  return request<AdminChangePasswordResponse>("/api/admin/settings/password", "PUT", payload);
}
