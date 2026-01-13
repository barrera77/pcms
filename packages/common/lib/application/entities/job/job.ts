import { JobStatus } from "lib/application/entities/job/job-status";
import { IBaseEntity } from "lib/pcms-core";

export interface IJob<T = string> extends IBaseEntity {
  _id: T;
  workOrder: string;
  date: Date;
  cityId: T;
  buildingId: T;
  unit: string;
  techId: T;
  clockInAt?: Date;
  clockOutAt?: Date;
  jobstatus: JobStatus;
}
