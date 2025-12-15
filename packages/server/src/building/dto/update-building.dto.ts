import { PartialType } from '@nestjs/swagger';
import { CreateBuildingDto } from 'src/building/dto/create-building.dto';

export class UpdateBuildingDto extends PartialType(CreateBuildingDto) {}
