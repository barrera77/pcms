import { PartialType } from '@nestjs/swagger';
import { CreateDepartmentDto } from 'src/department/dto/create-department.dto';

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
