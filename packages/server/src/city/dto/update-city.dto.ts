import { PartialType } from '@nestjs/swagger';
import { CreateCityDto } from 'src/city/dto/create-city.dto';

export class UpdateCityDto extends PartialType(CreateCityDto) {}
