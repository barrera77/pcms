import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DepartmentService } from 'src/department/department.service';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';
import { UpdateEmployeeDto } from 'src/employee/dto/update-employee.dto';
import { Employee, EmployeeDocument } from 'src/employee/employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name)
    private employeeModel: Model<EmployeeDocument>,
    private departmentService: DepartmentService,
  ) {}

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const department = await this.departmentService.findById(dto.departmentId);

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return this.employeeModel.create({
      ...dto,
      departmentId: dto.departmentId,
    });
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeModel
      .find()
      .populate({ path: 'departmentId', select: 'name' })
      .exec();
  }

  async findByName(name: string): Promise<Employee | null> {
    return this.employeeModel
      .findOne({ name })
      .populate({ path: 'departmentId', select: 'name' })
      .exec();
  }

  async findByRole(role: string): Promise<Employee[]> {
    return this.employeeModel.find({ role }).populate('department').exec();
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const updated = await this.employeeModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException('Employee not found');
    }
    return updated;
  }

  async remove(id: string): Promise<Employee> {
    const employee = await this.employeeModel.findByIdAndUpdate(
      { _id: id, isInactive: false },
      { isInactive: true, inactiveAt: new Date() },
      { new: true },
    );
    if (!employee) {
      throw new NotFoundException('Employee not found or already inactive');
    }

    return employee;
  }
}
