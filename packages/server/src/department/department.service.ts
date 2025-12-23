import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Building } from 'src/building/building.entity';
import {
  Department,
  DepartmentDocument,
} from 'src/department/department.entity';
import { CreateDepartmentDto } from 'src/department/dto/create-department.dto';
import { UpdateDepartmentDto } from 'src/department/dto/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name)
    private departmentModel: Model<DepartmentDocument>,
  ) {}

  async create(dto: CreateDepartmentDto): Promise<Department> {
    return this.departmentModel.create(dto);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentModel.find().exec();
  }

  async findById(id: string): Promise<Department> {
    const department = await this.departmentModel.findById(id).exec();
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    return department;
  }

  async update(id: string, dto: UpdateDepartmentDto): Promise<Department> {
    const updated = await this.departmentModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException('Department not found or already inactive');
    }
    return updated;
  }

  async remove(id: string): Promise<Department> {
    const department = await this.departmentModel.findOneAndUpdate(
      { _id: id, isInactive: false },
      { isInactive: true, inactiveAt: new Date() },
      { new: true },
    );

    if (!department) {
      throw new NotFoundException('Department not found or already innactive');
    }

    return department;
  }
}
