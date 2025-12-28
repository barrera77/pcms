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
  ApiTags,
} from '@nestjs/swagger';
import { DepartmentService } from 'src/department/department.service';
import { CreateDepartmentDto } from 'src/department/dto/create-department.dto';
import { DepartmentDto } from 'src/department/dto/department-output.dto';
import { UpdateDepartmentDto } from 'src/department/dto/update-department.dto';

@ApiTags('Departments')
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @ApiOperation({ summary: 'Add a department' })
  @ApiCreatedResponse({
    description: 'Building created successfully',
    type: DepartmentDto,
  })
  create(@Body() dto: CreateDepartmentDto) {
    return this.departmentService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all departments' })
  @ApiOkResponse({
    description: 'List of departments returned succesfully',
    type: [DepartmentDto],
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  findAll() {
    return this.departmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departmentService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a department' })
  @ApiOkResponse({
    description: 'Department updated successfully',
    type: DepartmentDto,
  })
  update(@Param('id') id: string, @Body() dto: UpdateDepartmentDto) {
    return this.departmentService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Deactivate department' })
  @ApiOkResponse({ description: 'Department marked as inactive succesfully' })
  @ApiNotFoundResponse({
    description: 'Department not found or marked as inactive',
  })
  remove(@Param('id') id: string) {
    return this.departmentService.remove(id);
  }
}
