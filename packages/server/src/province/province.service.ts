import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProvinceDto } from 'src/province/dto/create-province.dto';
import { UpdateProvinceDto } from 'src/province/dto/update-province.dto';
import { Province, ProvinceDocument } from 'src/province/province.entity';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectModel(Province.name)
    private provinceModel: Model<ProvinceDocument>,
  ) {}

  async create(dto: CreateProvinceDto): Promise<Province> {
    const newProvince = new this.provinceModel(dto);
    return newProvince.save();
  }

  async findAll(): Promise<Province[]> {
    return this.provinceModel.find().exec();
  }

  async findById(id: string): Promise<Province> {
    const province = await this.provinceModel.findById(id).exec();
    if (!province) {
      throw new NotFoundException('Province not found');
    }
    return province;
  }

  async update(id: string, dto: UpdateProvinceDto): Promise<Province> {
    const updated = await this.provinceModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException('Province not found');
    }
    return updated;
  }

  async remove(id: string): Promise<Province> {
    const province = await this.provinceModel.findById(id);
    if (!province) {
      throw new NotFoundException('Province not found');
    }
    province.isInactive = true;
    province.inactiveAt = new Date();
    return province.save();
  }
}
