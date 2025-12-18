import { Body, Controller, Get, Post } from '@nestjs/common';
import { CityService } from 'src/city/city.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCityDto } from 'src/city/dto/create-city.dto';

@ApiTags('Cities')
@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  @ApiOperation({ summary: 'Add a city ' })
  @ApiResponse({ status: 201, description: 'City added succesfully' })
  async create(@Body() dto: CreateCityDto) {
    return this.cityService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all cities' })
  @ApiResponse({ status: 200, description: 'List of cities' })
  async findAll() {
    return this.cityService.findAll();
  }
}
