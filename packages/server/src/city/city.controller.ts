import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CityService } from 'src/city/city.service';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CreateCityDto } from 'src/city/dto/create-city.dto';
import { CityDto } from 'src/city/dto/city-output.dto';
import { UpdateCityDto } from 'src/city/dto/update-city.dto';

@ApiTags('Cities')
@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  @ApiOperation({ summary: 'Add a city ' })
  @ApiCreatedResponse({
    description: 'Building created successfully',
    type: CityDto,
  })
  create(@Body() dto: CreateCityDto) {
    return this.cityService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all cities' })
  @ApiOkResponse({ description: 'List of cities returned successfully' })
  async findAll() {
    return this.cityService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a city' })
  @ApiOkResponse({
    description: 'City updated successfully',
    type: CityDto,
  })
  update(@Param('id') id: string, @Body() dto: UpdateCityDto) {
    return this.cityService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Deactivate city' })
  @ApiOkResponse({ description: 'City marked as inactive succesfully' })
  @ApiNotFoundResponse({ description: 'City not found' })
  remove(@Param('id') id: string) {
    return this.cityService.remove(id);
  }
}
