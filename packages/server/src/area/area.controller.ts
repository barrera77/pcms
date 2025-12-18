import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AreaService } from 'src/area/area.service';
import { CreateAreaDto } from 'src/area/dto/create-area.dto';
import { UpdateAreaDto } from 'src/area/dto/update-area.dto';

@ApiTags('Area')
@Controller('areas')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new area' })
  @ApiResponse({
    status: 201,
    description: 'The area was successfully created',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() dto: CreateAreaDto) {
    return this.areaService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all areas' })
  @ApiResponse({ status: 200, description: 'Returns a list of all areas' })
  findAll() {
    return this.areaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an area by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the area with the specified ID',
  })
  @ApiResponse({ status: 404, description: 'Area not found' })
  findOne(@Param('id') id: string) {
    return this.areaService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing area' })
  @ApiResponse({
    status: 200,
    description: 'The area was successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Area not found' })
  update(@Param('id') id: string, @Body() dto: UpdateAreaDto) {
    return this.areaService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete an area' })
  @ApiResponse({ status: 200, description: 'The area was marked as inactive' })
  @ApiResponse({ status: 404, description: 'Area not found' })
  remove(@Param('id') id: string) {
    return this.areaService.remove(id);
  }
}
