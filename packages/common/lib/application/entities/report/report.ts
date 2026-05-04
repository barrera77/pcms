import { IProductUsage } from "lib/application/entities/product/product-usage";
import { ReportStatus } from "lib/application/entities/report/report-status";
import { SeverityLevel } from "lib/application/entities/report/severity";
import { TreatmentType } from "lib/application/entities/report/treatment-type";

//This interface may need revision as we need to compare the entity with an actual report
export interface IReport<T = string> {
  _id: T;
  techIds: T[];
  date: string;
  cityId: T;
  buildingId: T;
  unit: string;
  workOrder: string;
  pestId: T[];
  treatmentType: TreatmentType[];
  treatmentNo: number;
  severity: SeverityLevel;
  performedBy: "in-house" | "contractor";
  contractorCompany?: string;
  productsUsed: IProductUsage<T>[];
  notes: string;
  requiresFollowUp: boolean;
  status: ReportStatus;
  submittedAt?: Date;
  submittedBy?: string;
}
