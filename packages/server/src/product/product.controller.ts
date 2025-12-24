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
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { ProductDto } from 'src/product/dto/product-output.dto';
import { UpdateProductDto } from 'src/product/dto/update-product.dto';
import { ProductService } from 'src/product/product.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Add a Product' })
  @ApiCreatedResponse({
    description: 'Product created succesfully',
    type: ProductDto,
  })
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all products' })
  @ApiOkResponse({
    description: 'List of products returned succesfully',
    type: [CreateProductDto],
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an product by ID' })
  @ApiOkResponse({
    description: 'Product retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  findOne(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Get(':name')
  @ApiOperation({ summary: 'List of products by name' })
  @ApiOkResponse({
    description: 'List of products by name returned succesfully',
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  findByName(@Param('pest') name: string) {
    return this.productService.findByName(name);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiOkResponse({
    description: 'Product updated successfully',
    type: ProductDto,
  })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Deactivate product' })
  @ApiOkResponse({ description: 'Product marked as inactive succesfully' })
  @ApiNotFoundResponse({ description: 'Product not found ' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
