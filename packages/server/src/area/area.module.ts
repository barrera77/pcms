import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AreaController } from 'src/area/area.controller';
import { Area, AreaSchema } from 'src/area/area.entity';
import { AreaService } from 'src/area/area.service';
import { CityModule } from 'src/city/city.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Area.name, schema: AreaSchema }]),
    CityModule,
  ],

  controllers: [AreaController],
  providers: [AreaService],
  exports: [AreaService],
})
export class AreaModule {}
