import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePestDto } from 'src/pest/dto/create-pest.dto';
import { UpdatePestDto } from 'src/pest/dto/update-pest.dto';
import { Pest, PestDocument } from 'src/pest/pest.entity';

@Injectable()
export class PestService {
  constructor(
    @InjectModel(Pest.name)
    private pestModel: Model<PestDocument>,
  ) {}

  async create(dto: CreatePestDto): Promise<Pest> {
    return this.pestModel.create(dto);
  }

  async findAll(): Promise<Pest[]> {
    return this.pestModel.find().exec();
  }

  async findByName(name: string): Promise<Pest | null> {
    return this.pestModel.findOne({ name }).exec();
  }

  async findByCatgory(category: string): Promise<Pest[]> {
    return this.pestModel.find({ category }).exec();
  }

  async findById(id: string): Promise<Pest | null> {
    const pest = await this.pestModel.findById(id).exec();

    if (!pest) {
      throw new NotFoundException('Pest not found');
    }
    return pest;
  }

  async findByIds(ids: string[]): Promise<Pest[]> {
    return this.pestModel.find({ _id: { $in: ids } }).exec();
  }

  async update(id: string, dto: UpdatePestDto): Promise<Pest> {
    const updated = await this.pestModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException('Pest not found');
    }
    return updated;
  }

  async remove(id: string): Promise<Pest> {
    const pest = await this.pestModel.findOneAndUpdate(
      { _id: id, isInactive: false },
      { isInactive: true, inactiveAt: new Date() },
      { new: true },
    );
    if (!pest) {
      throw new NotFoundException();
    }

    return pest;
  }
}
