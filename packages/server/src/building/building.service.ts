import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AreaService } from 'src/area/area.service';
import { Building, BuildingDocument } from 'src/building/building.entity';
import { CreateBuildingDto } from 'src/building/dto/create-building.dto';

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
}
