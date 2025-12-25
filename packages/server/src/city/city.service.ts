import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City, CityDocument } from 'src/city/city.entity';
import { CreateCityDto } from 'src/city/dto/create-city.dto';
import { UpdateCityDto } from 'src/city/dto/update-city.dto';
import { ProvinceService } from 'src/province/province.service';

@Injectable()
export class CityService {
  constructor(
    @InjectModel(City.name) private cityModel: Model<CityDocument>,
    private provinceService: ProvinceService,
  ) {}

  async create(dto: CreateCityDto): Promise<City> {
    const province = await this.provinceService.findById(dto.provinceId);

    if (!province) {
      throw new NotFoundException('Province not found');
    }

    return this.cityModel.create({
      ...dto,
      province: dto.provinceId,
    });
  }

  async findAll(): Promise<City[]> {
    return this.cityModel
      .find()
      .populate({ path: 'province', select: 'name' })
      .exec();
  }

  async findById(id: string): Promise<City | null> {
    const city = await this.cityModel.findById(id).exec();
    if (!city) {
      throw new NotFoundException('City not found');
    }
    return city;
  }

  async update(id: string, dto: UpdateCityDto): Promise<City> {
    const updated = await this.cityModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException('City not found');
    }
    return updated;
  }

  async remove(id: string): Promise<City> {
    const city = await this.cityModel.findByIdAndUpdate(
      { _id: id, isInactive: false },
      { isInactive: true, inactiveAt: new Date() },
      { new: true },
    );

    if (!city) {
      throw new NotFoundException('City not found or already inactive');
    }

    return city;
  }
}
