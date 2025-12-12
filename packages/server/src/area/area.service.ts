import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Area, AreaDocument } from 'src/area/area.entity';
import { CreateAreaDto } from 'src/area/dto/create-area.dto';
import { UpdateAreaDto } from 'src/area/dto/update-area.dto';
import { CityService } from 'src/city/city.service';

@Injectable()
export class AreaService {
  constructor(
    @InjectModel(Area.name)
    private areaModel: Model<AreaDocument>,
    private cityService: CityService,
  ) {}

  async create(dto: CreateAreaDto): Promise<Area> {
    const city = await this.cityService.findById(dto.cityId);

    if (!city) {
      throw new NotFoundException('City nor found');
    }

    const createArea = new this.areaModel({
      name: dto.name,
      city: dto.cityId,
      manager: dto.managerId,
      technicians: dto.techIds,
    });

    return createArea.save();
  }

  async findAll(): Promise<Area[]> {
    return this.areaModel.find().populate('area').exec();
  }

  async findById(id: string): Promise<Area> {
    const area = await this.areaModel.findById(id).exec();
    if (!area) {
      throw new NotFoundException('Area not found');
    }
    return area;
  }

  async update(id: string, dto: UpdateAreaDto): Promise<Area> {
    const updated = await this.areaModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException('Area not found');
    }
    return updated;
  }

  async remove(id: string): Promise<Area> {
    const area = await this.areaModel.findById(id);
    if (!area) {
      throw new NotFoundException('Area not found');
    }
    area.isInactive = true;
    area.inactiveAt = new Date();
    return area.save();
  }
}
