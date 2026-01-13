export const JobStatuses = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  RESCHEDULED: "rescheduled",
} as const;

export type JobStatus = (typeof JobStatuses)[keyof typeof JobStatuses];
