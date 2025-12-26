import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AreaModule } from 'src/area/area.module';
import { BuildingController } from 'src/building/building.controller';
import { Building, BuildingSchema } from 'src/building/building.entity';
import { BuildingService } from 'src/building/building.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Building.name, schema: BuildingSchema },
    ]),
    AreaModule,
  ],
  controllers: [BuildingController],
  providers: [BuildingService],
  exports: [BuildingService],
})
export class BuildingModule {}
