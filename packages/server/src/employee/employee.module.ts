import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Department, DepartmentSchema } from 'src/department/department.entity';
import { DepartmentModule } from 'src/department/department.module';
import { EmployeeController } from 'src/employee/employee.controller';
import { Employee, EmployeeSchema } from 'src/employee/employee.entity';
import { EmployeeService } from 'src/employee/employee.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: Department.name, schema: DepartmentSchema },
    ]),
    DepartmentModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
