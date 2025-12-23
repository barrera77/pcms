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
import { CreatePestDto } from 'src/pest/dto/create-pest.dto';
import { PestDto } from 'src/pest/dto/pest-output.dto';
import { UpdatePestDto } from 'src/pest/dto/update-pest.dto';
import { PestService } from 'src/pest/pest.service';

@ApiTags('Pest')
@Controller('pests')
export class PestController {
  constructor(private readonly pestService: PestService) {}

  @Post()
  @ApiOperation({ summary: 'Add a pest' })
  @ApiCreatedResponse({
    description: 'Pest added succesfully',
    type: PestDto,
  })
  create(@Body() dto: CreatePestDto) {
    return this.pestService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all pests' })
  @ApiOkResponse({
    description: 'List of pests returned succesfully',
    type: [PestDto],
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  findAll() {
    return this.pestService.findAll();
  }

  @Get(':name')
  @ApiOperation({ summary: 'List of pest by name' })
  @ApiOkResponse({
    description: 'List of pests by name returned succesfully',
  })
  @ApiNotFoundResponse({ description: 'Pest not found' })
  findByName(@Param('pest') name: string) {
    return this.pestService.findByName(name);
  }

  @Get(':category')
  @ApiOperation({ summary: 'List of pest by category' })
  @ApiOkResponse({
    description: 'List of pests by category returned succesfully',
  })
  @ApiNotFoundResponse({ description: 'Pest not found' })
  findByCategory(@Param('pest') category: string) {
    return this.pestService.findByName(category);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a pest' })
  @ApiOkResponse({ description: 'Pest updated usccesfully' })
  @ApiNotFoundResponse({ description: 'Pest not found' })
  update(@Param('id') id: string, @Body() dto: UpdatePestDto) {
    return this.pestService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate a pest' })
  @ApiOkResponse({ description: 'Pest marked as inactive successfully' })
  @ApiNotFoundResponse({ description: 'Pest not found' })
  remove(@Param('id') id: string) {
    return this.pestService.remove(id);
  }
}
