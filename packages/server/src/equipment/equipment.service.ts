import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEquipmentDto } from 'src/equipment/dto/create-equipment.dto';
import { UpdateEquipmentDto } from 'src/equipment/dto/update-equipment.dto';
import { Equipment, EquipmentDocument } from 'src/equipment/equipment.entity';
import { SupplierService } from 'src/supplier/supplier.service';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectModel(Equipment.name)
    private equipmentModel: Model<EquipmentDocument>,
    private supplierService: SupplierService,
  ) {}

  async create(dto: CreateEquipmentDto): Promise<Equipment> {
    const supplier = await this.supplierService.findById(dto.supplier);

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }
    return this.equipmentModel.create({
      ...dto,
      supplier: dto.supplier,
    });
  }

  async update(id: string, dto: UpdateEquipmentDto): Promise<Equipment> {
    const updated = await this.equipmentModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException('Department not found');
    }
    return updated;
  }

  async findAll(): Promise<Equipment[]> {
    return this.equipmentModel.find().exec();
  }

  async findById(id: string): Promise<Equipment | null> {
    const equipment = await this.equipmentModel.findById(id).exec();

    if (!equipment) {
      throw new NotFoundException('Equipment item not found');
    }

    return equipment;
  }

  async findByName(name: string): Promise<Equipment | null> {
    return this.equipmentModel.findOne({ name }).exec();
  }

  async remove(id: string): Promise<Equipment> {
    const department = await this.equipmentModel.findOneAndUpdate(
      { _id: id, isInactive: false },
      { isInactive: true, inactiveAt: new Date() },
      { new: true },
    );

    if (!department) {
      throw new NotFoundException('Equipment not found or already innactive');
    }

    return department;
  }
}
