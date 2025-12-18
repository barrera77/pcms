import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';
import { UpdateEmployeeDto } from 'src/employee/dto/update-employee.dto';
import { EmployeeService } from 'src/employee/employee.service';

@ApiTags('Employees')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiOperation({ summary: 'Add employees' })
  @ApiResponse({ status: 201, description: 'Employee added succesfully' })
  async create(@Body() dto: CreateEmployeeDto) {
    return this.employeeService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all employees' })
  @ApiResponse({ status: 200, description: 'List of employees' })
  async findAll() {
    return this.employeeService.findAll();
  }

  @Get(':name')
  @ApiOperation({ summary: 'List of employees by name' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of employees that match the provided name',
  })
  async findByName(@Param('name') name: string) {
    return this.employeeService.findByName(name);
  }

  @Get(':role')
  @ApiOperation({ summary: 'List of employees by role' })
  @ApiResponse({
    status: 200,
    description: 'Resturns a list of employees that match the provided role',
  })
  async findByRole(@Param('role') role: string) {
    return this.employeeService.findByRole(role);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an employee' })
  @ApiResponse({ status: 200, description: 'update the selected employee' })
  async update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.employeeService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate employee' })
  @ApiResponse({ status: 200, description: 'Deactivate the selected employee' })
  async remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}
