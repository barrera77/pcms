import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CityController } from 'src/city/city.controller';
import { City, CitySchema } from 'src/city/city.entity';
import { CityService } from 'src/city/city.service';
import { ProvinceModule } from 'src/province/province.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
    ProvinceModule,
  ],
  controllers: [CityController],
  providers: [CityService],
  exports: [CityService],
})
export class CityModule {}
