import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EquipmentService } from 'src/equipment/equipment.service';
import { CreateInventoryDto } from 'src/inventory/dto/create-inventory.dto';
import { UpdateInventoryDto } from 'src/inventory/dto/update-inventory.dto';
import { Inventory, InventoryDocument } from 'src/inventory/inventory.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private inventoryModel: Model<InventoryDocument>,
    private productService: ProductService,
    private equipmentService: EquipmentService,
  ) {}

  //This may need to be reqorked as I have no idea what did I do
  async create(dto: CreateInventoryDto): Promise<Inventory> {
    if (dto.itemType === 'product') {
      const product = await this.productService.findById(dto.itemId);

      if (!product) {
        throw new NotFoundException('Product not found');
      }
    } else if (dto.itemType === 'equipment') {
      const equipment = await this.equipmentService.findById(dto.itemId);

      if (!equipment) {
        throw new NotFoundException('Equipment item not found');
      }
    }
    const existingInventory = await this.inventoryModel.findOne({
      itemId: dto.itemId,
      itemType: dto.itemType,
    });

    if (existingInventory) {
      throw new BadRequestException(
        'Inventory entry already exists for this item',
      );
    }
    return this.inventoryModel.create(dto);
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryModel.find().exec();
  }

  async findByName(name: string): Promise<Inventory | null> {
    return this.inventoryModel.findOne({ name }).exec();
  }

  async findById(id: string): Promise<Inventory> {
    const inventoryItem = await this.inventoryModel.findById(id).exec();
    if (!inventoryItem) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
    return inventoryItem;
  }

  async updateInventoryItem(id: string): Promise<Inventory> {
    const inventoryItem = await this.inventoryModel
      .findByIdAndUpdate(id)
      .exec();

    if (!inventoryItem) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
    return inventoryItem;
  }

  async update(id: string, dto: UpdateInventoryDto): Promise<Inventory> {
    const inventory = await this.inventoryModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }

    return inventory;
  }

  async checkLowStock(): Promise<Inventory[]> {
    return this.inventoryModel
      .find({ $expr: { $lte: ['$quantity', '$minimumThreshold'] } })
      .exec();
  }

  async remove(id: string): Promise<Inventory> {
    const inventory = await this.inventoryModel.findByIdAndUpdate(
      { _id: id, isInactive: false },
      { isInactive: true, inactiveAt: new Date() },
      { new: true },
    );
    if (!inventory) {
      throw new NotFoundException(
        'Inventory item not found or already inactive',
      );
    }

    return inventory;
  }
}
