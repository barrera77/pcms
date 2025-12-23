import { PartialType } from '@nestjs/swagger';
import { CreateEquipmentDto } from 'src/equipment/dto/create-equipment.dto';

export class UpdateEquipmentDto extends PartialType(CreateEquipmentDto) {}
