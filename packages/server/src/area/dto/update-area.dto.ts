import { PartialType } from '@nestjs/swagger';
import { CreateAreaDto } from 'src/area/dto/create-area.dto';

export class UpdateAreaDto extends PartialType(CreateAreaDto) {}
