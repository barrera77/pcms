import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City, CityDocument } from 'src/city/city.entity';
import { CreateCityDto } from 'src/city/dto/create-city.dto';
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

    const createdCity = new this.cityModel({
      name: dto.name,
      province: dto.provinceId,
    });

    return createdCity.save();
  }

  async findAll(): Promise<City[]> {
    return this.cityModel.find().populate('province').exec();
  }

  async findById(id: string): Promise<City> {
    const city = await this.cityModel.findById(id).exec();
    if (!city) {
      throw new NotFoundException('City not found');
    }
    return city;
  }

  async remove(id: string): Promise<City> {
    const city = await this.cityModel.findById(id);
    if (!city) {
      throw new NotFoundException('City not found');
    }
    city.isInactive = true;
    city.inactiveAt = new Date();
    return city.save();
  }
}
