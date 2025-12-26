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
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BuildingService } from 'src/building/building.service';
import { CreateBuildingDto } from 'src/building/dto/create-building.dto';
import { UpdateBuildingDto } from 'src/building/dto/update-building.dto';
import { BuildingDto } from 'src/building/dto/building-output.dto';
import { Building } from 'src/building/building.entity';

@ApiTags('Buildings')
@Controller('building')
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  @Post()
  @ApiOperation({ summary: 'Add a building' })
  @ApiCreatedResponse({
    description: 'Building created successfully',
    type: BuildingDto,
  })
  async create(@Body() dto: CreateBuildingDto) {
    return this.buildingService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all buildings' })
  @ApiOkResponse({
    description: 'List of buildings returned succesfully',
    type: [BuildingDto],
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findAll() {
    return this.buildingService.findAll();
  }

  @Get(':name')
  @ApiOperation({ summary: 'List buildings by name' })
  @ApiOkResponse({
    description: 'List of buildings by name returned succesfully',
    type: [BuildingDto],
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findByname(@Param('name') name: string) {
    return this.buildingService.findByName(name);
  }

  @Get(':area')
  @ApiOperation({ summary: 'List buildings by area' })
  @ApiOkResponse({
    description: 'Returns a list of buildings that match the provided area',
    type: [BuildingDto],
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findByArea(@Param('area') area: string) {
    return this.buildingService.findByArea(area);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a building' })
  @ApiOkResponse({
    description: 'Building updated successfully',
    type: BuildingDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Building not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBuildingDto,
  ): Promise<Building> {
    return this.buildingService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Deactivate building' })
  @ApiOkResponse({ description: 'Building marked as inactive succesfully' })
  @ApiNotFoundResponse({ description: 'Building not found' })
  async remove(@Param('id') id: string) {
    return this.buildingService.remove(id);
  }
}
