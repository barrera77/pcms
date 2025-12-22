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
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
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
  @ApiOkResponse({ description: 'List of areas returned succesfully' })
  findAll() {
    return this.areaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an area by ID' })
  @ApiOkResponse({
    description: 'Area retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Area not found' })
  findOne(@Param('id') id: string) {
    return this.areaService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing area' })
  @ApiOkResponse({
    description: 'Area updated successfully ',
  })
  @ApiNotFoundResponse({ description: 'Area not found' })
  update(@Param('id') id: string, @Body() dto: UpdateAreaDto) {
    return this.areaService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete an area' })
  @ApiOkResponse({ description: 'Area marked as inactive successfully' })
  @ApiNotFoundResponse({ description: 'Area not found' })
  remove(@Param('id') id: string) {
    return this.areaService.remove(id);
  }
}
