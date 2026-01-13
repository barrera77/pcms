import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportStatuses } from '@pcms/pcms-common';
import { Model, Types } from 'mongoose';
import { EmployeeService } from 'src/employee/employee.service';
import { JobService } from 'src/job/job.service';
import { PestService } from 'src/pest/pest.service';
import { CreateReportDto } from 'src/report/dto/create-report.dto';
import { SearchReportsDto } from 'src/report/dto/search-reports.dto';
import { UpdateReportDto } from 'src/report/dto/update-report.dto';
import { Report, ReportDocument } from 'src/report/report.entity';
import { UserDocument } from 'src/user/user-entity';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class ReportService {
  private readonly uploadPath = process.env.UPLOAD_PATH || './uploads/reports';

  constructor(
    @InjectModel(Report.name)
    private reportModel: Model<ReportDocument>,
    private jobService: JobService,
    private employeeService: EmployeeService,
    private pestService: PestService,
  ) {}

  async create(dto: CreateReportDto): Promise<Report> {
    const job = await this.jobService.findById(dto.jobId);
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const techs = await this.employeeService.findByIds(dto.techIds);

    if (techs.length !== dto.techIds.length) {
      throw new BadRequestException('One or more technicians not found');
    }

    const pests = await this.pestService.findByIds(dto.pestId);
    if (pests.length !== dto.pestId.length) {
      throw new BadRequestException('One or more pests not found');
    }

    return this.reportModel.create({
      ...dto,
      jobId: new Types.ObjectId(dto.jobId),
      pestId: dto.pestId.map((id) => new Types.ObjectId(id)),
      techIds: dto.techIds.map((id) => new Types.ObjectId(id)),
      productUsage: dto.productUsage.map((pu) => ({
        ...pu,
        productId: new Types.ObjectId(pu.productId),
      })),
    });
  }

  async findById(id: string): Promise<Report | null> {
    const report = await this.reportModel.findById(id).exec();
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return report;
  }

  async search(dto: SearchReportsDto): Promise<{
    reports: Report[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = dto;

    const query: any = {};

    if (dto.status) {
      query.status = dto.status;
    }

    if (dto.techId) {
      query.techIds = new Types.ObjectId(dto.techId);
    }

    if (dto.pestId) {
      query.pestId = new Types.ObjectId(dto.pestId);
    }

    if (dto.startDate || dto.endDate) {
      query.date = {};
      if (dto.startDate) query.date.$gte = dto.startDate;
      if (dto.endDate) query.date.$lte = dto.endDate;
    }

    const jobMatch: any = {};
    if (dto.cityId) {
      jobMatch.cityId = new Types.ObjectId(dto.cityId);
    }
    if (dto.buildingId) {
      jobMatch.buildingId = new Types.ObjectId(dto.buildingId);
    }
    if (dto.unit) {
      jobMatch.unit = { $regex: dto.unit, $options: 'i' };
    }
    if (dto.workOrder) {
      jobMatch.workOrder = { $regex: dto.workOrder, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const sortField = sortBy === 'createdAt' ? sortBy : `job.${sortBy}`;
    const sort: Record<string, 1 | -1> = {
      [sortField]: sortOrder === 'asc' ? 1 : -1,
    };

    if (Object.keys(jobMatch).length > 0) {
      const pipeline = [
        {
          $lookup: {
            from: 'job',
            localField: 'jobId',
            foreignField: '_id',
            as: 'job',
          },
        },
        { $unwind: '$job' },
        {
          $match: Object.fromEntries(
            Object.entries(jobMatch).map(([key, value]) => [
              `job.${key}`,
              value,
            ]),
          ),
        },
        ...(Object.keys(query).length > 0 ? [{ $match: query }] : []),
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              { $sort: sort },
              { $skip: skip },
              { $limit: limit },
              {
                $lookup: {
                  from: 'city',
                  localField: 'job.cityId',
                  foreignField: '_id',
                  as: 'job.city',
                },
              },
              {
                $lookup: {
                  from: 'building',
                  localField: 'job.buildingId',
                  foreignField: '_id',
                  as: 'job.building',
                },
              },
              {
                $lookup: {
                  from: 'employee',
                  localField: 'techIds',
                  foreignField: '_id',
                  as: 'techs',
                },
              },
              {
                $lookup: {
                  from: 'pest',
                  localField: 'pestId',
                  foreignField: '_id',
                  as: 'pests',
                },
              },
            ],
          },
        },
      ];

      const [result] = await this.reportModel.aggregate(pipeline).exec();
      const total = result.metadata[0]?.total || 0;
      const reports = result.data || [];

      return {
        reports,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    const [reports, total] = await Promise.all([
      this.reportModel
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'jobId',
          populate: [
            { path: 'cityId', select: 'name' },
            { path: 'buildingId', select: 'name address' },
          ],
        })
        .populate('techIds', 'firstName lastName')
        .populate('pestId', 'name')
        .exec(),
      this.reportModel.countDocuments(query),
    ]);

    return {
      reports,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(
    id: string,
    dto: UpdateReportDto,
    user: UserDocument,
  ): Promise<Report> {
    const report = await this.reportModel.findById(id);

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (!this.canUserEditReport(user, report)) {
      throw new ForbiddenException(
        'You do not have permission to edit this report',
      );
    }

    const updateData = this.convertDtoToEntity(dto);

    const updatedReport = await this.reportModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    if (!updatedReport) {
      throw new NotFoundException('Report not found');
    }

    return updatedReport;
  }

  private canUserEditReport(user: UserDocument, report: Report): boolean {
    // Admins and supervisors can always edit
    if (user.role === 'ADMIN' || user.role === 'SUPERVISOR') {
      return true;
    }

    // Techs can only edit if:
    // 1. Report is in DRAFT status
    // 2. They are assigned to the report
    const isAssignedTech = report.techIds.some(
      (techId) => techId.toString() === user._id.toString(),
    );

    return isAssignedTech && report.status === ReportStatuses.DRAFT;
  }

  private convertDtoToEntity(dto: UpdateReportDto) {
    const updateData: any = { ...dto };

    if (dto.pestId) {
      updateData.pestId = dto.pestId.map((id) => new Types.ObjectId(id));
    }

    if (dto.techIds) {
      updateData.techIds = dto.techIds.map((id) => new Types.ObjectId(id));
    }

    if (dto.productUsage) {
      updateData.productUsage = dto.productUsage.map((pu) => ({
        ...pu,
        productId: new Types.ObjectId(pu.productId),
      }));
    }

    return updateData;
  }
}
