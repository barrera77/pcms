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

    const createdEmployee = new this.employeeModel({
      name: dto.name,
      department: dto.departmentId,
      phone: dto.phone,
      email: dto.email,
      role: dto.role,
    });

    return createdEmployee.save();
  }
  async findAll(): Promise<Employee[]> {
    return this.employeeModel.find().populate('department').exec();
  }

  async findByName(name: string): Promise<Employee | null> {
    return this.employeeModel.findOne({ name }).populate('department').exec();
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
    const employee = await this.employeeModel.findById(id);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    employee.isInactive = true;
    employee.inactiveAt = new Date();
    return employee.save();
  }
}
