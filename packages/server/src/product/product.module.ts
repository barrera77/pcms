import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from 'src/product/product.controller';
import { Product, ProductSchema } from 'src/product/product.entity';
import { ProductService } from 'src/product/product.service';
import { SupplierModule } from 'src/supplier/supplier.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    SupplierModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
