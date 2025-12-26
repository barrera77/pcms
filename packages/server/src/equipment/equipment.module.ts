import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EquipmentController } from 'src/equipment/equipment.controller';
import { Equipment, EquipmentSchema } from 'src/equipment/equipment.entity';
import { EquipmentService } from 'src/equipment/equipment.service';
import { SupplierModule } from 'src/supplier/supplier.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Equipment.name, schema: EquipmentSchema },
    ]),
    SupplierModule,
  ],
  controllers: [EquipmentController],
  providers: [EquipmentService],
  exports: [EquipmentService],
})
export class EquipmentModule {}
