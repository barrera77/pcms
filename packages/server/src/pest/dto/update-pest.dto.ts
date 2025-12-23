import { PartialType } from '@nestjs/swagger';
import { CreatePestDto } from 'src/pest/dto/create-pest.dto';

export class UpdatePestDto extends PartialType(CreatePestDto) {}
