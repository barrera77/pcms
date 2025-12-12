import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProvinceDto } from 'src/province/dto/create-province.dto';
import { UpdateProvinceDto } from 'src/province/dto/update-province.dto';
import { ProvinceService } from 'src/province/province.service';

@ApiTags('Province')
@Controller('provinces')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Post()
  create(@Body() dto: CreateProvinceDto) {
    return this.provinceService.create(dto);
  }

  @Get()
  findAll() {
    return this.provinceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.provinceService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProvinceDto) {
    return this.provinceService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.provinceService.remove(id);
  }
}
