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
import { CreateInventoryDto } from 'src/inventory/dto/create-inventory.dto';
import { InventoryDto } from 'src/inventory/dto/inventory-output.dto';
import { UpdateInventoryDto } from 'src/inventory/dto/update-inventory.dto';
import { InventoryService } from 'src/inventory/inventory.service';

@ApiTags('Inventory Items')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @ApiOperation({ summary: 'Add a department' })
  @ApiCreatedResponse({
    description: 'Building created successfully',
    type: InventoryDto,
  })
  create(@Body() dto: CreateInventoryDto) {
    return this.inventoryService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all inventory items' })
  @ApiOkResponse({
    description: 'List of inventory items',
    type: [InventoryDto],
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':name')
  @ApiOperation({ summary: 'List of inventory items by name' })
  @ApiOkResponse({
    description: 'List of inventory items by name returned succesfully',
  })
  @ApiNotFoundResponse({ description: 'Inventory item not found' })
  findByName(@Param('name') name: string) {
    return this.inventoryService.findByName(name);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get inventory items with low stock' })
  @ApiOkResponse({
    description: 'List of low stock items retrieved successfully',
  })
  checkLowStock() {
    return this.inventoryService.checkLowStock();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Inventory Item' })
  @ApiOkResponse({ description: 'Inventory item updated successfully' })
  @ApiNotFoundResponse({ description: 'Inventory item not found' })
  update(@Param('id') id: string, @Body() dto: UpdateInventoryDto) {
    return this.inventoryService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate inventory item' })
  @ApiOkResponse({
    description: 'Inventory item marked as inactive successfully',
  })
  @ApiNotFoundResponse({ description: 'Inventory item not found' })
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }
}
