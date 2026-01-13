export const ReportStatuses = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  FINALIZED: "finalized",
} as const;

export type ReportStatus = (typeof ReportStatuses)[keyof typeof ReportStatuses];
