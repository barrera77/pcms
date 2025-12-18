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

    const createBuilding = new this.buildingModel({
      name: dto.name,
      area: dto.areaId,
      numOfUnits: dto.numOfUnits,
      units: dto.units,
    });
    return createBuilding.save();
  }

  async findAll(): Promise<Building[]> {
    return this.buildingModel.find().populate('building').exec();
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
    const building = await this.buildingModel.findById(id);

    if (!building) {
      throw new NotFoundException('Building nort found');
    }
    building.isInactive = true;
    building.inactiveAt = new Date();
    return building.save();
  }
}
