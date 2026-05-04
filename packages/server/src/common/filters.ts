export const REPORT_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'workOrder',
  'unit',
] as const;

export type ReportSortField = (typeof REPORT_SORT_FIELDS)[number];
