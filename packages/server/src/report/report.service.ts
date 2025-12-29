import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportStatuses } from '@pcms/pcms-common';
import { Model, Types } from 'mongoose';
import { BuildingService } from 'src/building/building.service';
import { CityService } from 'src/city/city.service';
import { EmployeeService } from 'src/employee/employee.service';
import { PestService } from 'src/pest/pest.service';
import { CreateReportDto } from 'src/report/dto/create-report.dto';
import { SearchReportsDto } from 'src/report/dto/search-reports.dto';
import { UpdateReportDto } from 'src/report/dto/update-report.dto';
import { Report, ReportDocument } from 'src/report/report.entity';
import { User, UserDocument } from 'src/user/user-entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name)
    private reportModel: Model<ReportDocument>,
    private cityService: CityService,
    private buildingService: BuildingService,
    private employeeService: EmployeeService,
    private pestService: PestService,
  ) {}

  async create(dto: CreateReportDto): Promise<Report> {
    const city = await this.cityService.findById(dto.cityId);
    if (!city) {
      throw new NotFoundException('City not found');
    }

    const building = await this.buildingService.findById(dto.buildingId);
    if (!building) {
      throw new NotFoundException('Building not found');
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
      cityId: dto.cityId,
      buildingId: dto.buildingId,
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

    if (dto.cityId) {
      query.cityId = new Types.ObjectId(dto.cityId);
    }

    if (dto.buildingId) {
      query.buildingId = new Types.ObjectId(dto.buildingId);
    }

    if (dto.unit) {
      query.unit = { $regex: dto.unit, $options: 'i' };
    }

    if (dto.techId) {
      query.techIds = new Types.ObjectId(dto.techId);
    }

    if (dto.workOrder) {
      query.workOrder = { $regex: dto.workOrder, $options: 'i' };
    }

    if (dto.pestId) {
      query.pestId = new Types.ObjectId(dto.pestId);
    }

    if (dto.startDate || dto.endDate) {
      query.date = {};
      if (dto.startDate) query.date.$gte = dto.startDate;
      if (dto.endDate) query.date.$lte = dto.endDate;
    }

    const skip = (page - 1) * limit;
    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };
    const [reports, total] = await Promise.all([
      this.reportModel
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('cityId', 'name')
        .populate('buildingId', 'name address')
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
