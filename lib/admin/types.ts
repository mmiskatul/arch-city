export type ApplicationStatus = "pending" | "approved" | "rejected";

export type ApplicationRow = {
  id: string;
  submittedOn: string;
  status: ApplicationStatus;
  name: string;
};

export type ApplicationSectionField =
  | { label: string; value: string; type?: "text" }
  | { label: string; value: boolean; type: "boolean" }
  | { label: string; value: string; type: "attachment" };

export type ApplicationSection = {
  title: string;
  fields: ApplicationSectionField[];
};

export type ApplicationDetail = ApplicationRow & {
  heading: string;
  sections: ApplicationSection[];
};
