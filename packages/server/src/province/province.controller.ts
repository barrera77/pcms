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
import { CreateProvinceDto } from 'src/province/dto/create-province.dto';
import { ProvinceDto } from 'src/province/dto/province-output.dto';
import { UpdateProvinceDto } from 'src/province/dto/update-province.dto';
import { ProvinceService } from 'src/province/province.service';

@ApiTags('Provinces')
@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Post()
  @ApiOperation({ summary: 'Add a province' })
  @ApiCreatedResponse({
    description: 'Province created successfully',
    type: ProvinceDto,
  })
  create(@Body() dto: CreateProvinceDto) {
    return this.provinceService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all provinces' })
  @ApiOkResponse({
    description: 'List of provinces returned succesfully',
    type: [ProvinceDto],
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  findAll() {
    return this.provinceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.provinceService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a province' })
  @ApiOkResponse({
    description: 'Province updated successfully',
    type: ProvinceDto,
  })
  update(@Param('id') id: string, @Body() dto: UpdateProvinceDto) {
    return this.provinceService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Deactivate province' })
  @ApiOkResponse({ description: 'Province marked as inactive succesfully' })
  @ApiNotFoundResponse({ description: 'Province not found' })
  remove(@Param('id') id: string) {
    return this.provinceService.remove(id);
  }
}
