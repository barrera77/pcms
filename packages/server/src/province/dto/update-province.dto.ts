import { PartialType } from '@nestjs/swagger';
import { CreateProvinceDto } from 'src/province/dto/create-province.dto';

export class UpdateProvinceDto extends PartialType(CreateProvinceDto) {}
