import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { User, UserDocument } from 'src/user/user-entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    return this.userModel.create(dto);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('user').exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const updated = await this.userModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException('User not found');
    }
    return updated;
  }

  async remove(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      { _id: id, isInactive: false },
      { isInactive: true, inactiveAt: new Date() },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found or already inactive');
    }

    return user;
  }
}
