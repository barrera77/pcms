import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AreaService } from 'src/area/area.service';
import { Building, BuildingDocument } from 'src/building/building.entity';
import { CreateBuildingDto } from 'src/building/dto/create-building.dto';
import { UpdateBuildingDto } from 'src/building/dto/update-building.dto';

@Injectable()
export class BuildingService {
  constructor(
    @InjectModel(Building.name)
    private buildingModel: Model<BuildingDocument>,
    private areaService: AreaService,
  ) {}

  async create(dto: CreateBuildingDto): Promise<Building> {
    const area = await this.areaService.findById(dto.areaId);

    if (!area) {
      throw new NotFoundException('Area not found');
    }

    return this.buildingModel.create({
      ...dto,
      areaId: dto.areaId,
    });
  }

  async findAll(): Promise<Building[]> {
    return this.buildingModel
      .find()
      .populate({ path: 'areaId', select: 'name' })
      .exec();
  }

  async findByName(name: string): Promise<Building | null> {
    return this.buildingModel.findOne({ name }).populate('building').exec();
  }

  async findByArea(area: string): Promise<Building | null> {
    return this.buildingModel.findOne({ area }).populate('department').exec();
  }

  async update(id: string, dto: UpdateBuildingDto): Promise<Building> {
    const updated = await this.buildingModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException('Building not found');
    }
    return updated;
  }

  async remove(id: string): Promise<Building> {
    const building = await this.buildingModel.findByIdAndUpdate(
      { _id: id, isInactive: false },
      { isInactive: true, inactiveAt: new Date() },
      { new: true },
    );

    if (!building) {
      throw new NotFoundException('Building nort found or already inactive');
    }

    return building;
  }
}
