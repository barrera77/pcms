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
import { CreateEquipmentDto } from 'src/equipment/dto/create-equipment.dto';
import { EquipmentDto } from 'src/equipment/dto/equipment-outpu.dto';
import { UpdateEquipmentDto } from 'src/equipment/dto/update-equipment.dto';
import { EquipmentService } from 'src/equipment/equipment.service';

@ApiTags('Equipment')
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post()
  @ApiOperation({ summary: 'Add a Equipment item' })
  @ApiCreatedResponse({
    description: 'Equipment created item successfully',
    type: EquipmentDto,
  })
  create(@Body() dto: CreateEquipmentDto) {
    return this.equipmentService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all equipment items' })
  @ApiOkResponse({
    description: 'List of equipment items returned successfully',
    type: [EquipmentDto],
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  findAll() {
    return this.equipmentService.findAll();
  }

  @Get(':name')
  @ApiOperation({ summary: 'List of equipment items by name' })
  @ApiOkResponse({
    description: 'List of equipment items by name returned successfully',
  })
  @ApiNotFoundResponse({ description: 'Area not found' })
  findByName(@Param('name') name: string) {
    return this.equipmentService.findByName(name);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an equipment item' })
  @ApiOkResponse({ description: 'Equipment item updated succesfully' })
  @ApiNotFoundResponse({ description: 'Equipment item not found' })
  update(@Param('id') id: string, @Body() dto: UpdateEquipmentDto) {
    return this.equipmentService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate equipment item' })
  @ApiOkResponse({
    description: 'Equipment item marked as inactive successfully',
  })
  @ApiNotFoundResponse({ description: 'Equipment item not found' })
  remove(@Param('id') id: string) {
    return this.equipmentService.remove(id);
  }
}
