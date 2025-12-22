import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CitySchema } from 'src/city/city.entity';
import { ProvinceModule } from 'src/province/province.module';
import { User } from 'src/user/user-entity';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: CitySchema }]),
    ProvinceModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModel {}
