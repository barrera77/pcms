import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRoles } from '@pcms/pcms-common';
import { Roles } from 'src/auth/roles.decorator';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';
import { EmployeeDto } from 'src/employee/dto/employee-output.dto';
import { UpdateEmployeeDto } from 'src/employee/dto/update-employee.dto';
import { EmployeeService } from 'src/employee/employee.service';

@ApiTags('Employees')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Roles(UserRoles.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Add employees' })
  @ApiCreatedResponse({
    description: 'Employee added succesfully',
    type: EmployeeDto,
  })
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeeService.create(dto);
  }

  @Roles(
    UserRoles.ADMIN,
    UserRoles.EXECUTIVE,
    UserRoles.MANAGER,
    UserRoles.SUPERVISOR,
  )
  @Get()
  @ApiOperation({ summary: 'List all employees' })
  @ApiOkResponse({ description: 'List of employees', type: [EmployeeDto] })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findAll() {
    return this.employeeService.findAll();
  }

  @Roles(
    UserRoles.ADMIN,
    UserRoles.EXECUTIVE,
    UserRoles.MANAGER,
    UserRoles.SUPERVISOR,
  )
  @Get(':name')
  @ApiOperation({ summary: 'List of employees by name' })
  @ApiOkResponse({
    description: 'List of employees by name returned succesfully',
  })
  @ApiNotFoundResponse({ description: 'Area not found' })
  findByName(@Param('name') name: string) {
    return this.employeeService.findByName(name);
  }

  @Roles(
    UserRoles.ADMIN,
    UserRoles.EXECUTIVE,
    UserRoles.MANAGER,
    UserRoles.SUPERVISOR,
  )
  @Get(':role')
  @ApiOperation({ summary: 'List of employees by role' })
  @ApiOkResponse({
    description: 'List of employees by role returned succesfully',
  })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  findByRole(@Param('role') role: string) {
    return this.employeeService.findByRole(role);
  }

  @Roles(UserRoles.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an employee' })
  @ApiOkResponse({ description: 'Employee updated succesfully' })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.employeeService.update(id, dto);
  }

  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate employee' })
  @ApiOkResponse({ description: 'Employee marked as inactive successfully' })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}
