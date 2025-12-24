import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { UpdateProductDto } from 'src/product/dto/update-product.dto';
import { Product, ProductDocument } from 'src/product/product.entity';
import { Supplier } from 'src/supplier/supplier.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    private supplierService: Model<Supplier>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const supplier = await this.supplierService.findById(dto.supplier);

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return this.productModel.create({
      ...dto,
      supplier: supplier._id,
    });
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().populate('supplier').exec();
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('supplier')
      .exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findByName(name: string): Promise<Product | null> {
    return this.productModel.findOne({ name }).populate('supplier').exec();
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const updated = await this.productModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException('Product not found');
    }
    return updated;
  }

  async remove(id: string): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(
      { _id: id, isInactive: false },
      { isInactive: true, inactiveAt: new Date() },
      { new: true },
    );
    if (!product) {
      throw new NotFoundException('Product not found or already inactive');
    }
    return product;
  }
}
