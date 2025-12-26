import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EquipmentModule } from 'src/equipment/equipment.module';
import { InventoryController } from 'src/inventory/inventory.controller';
import { Inventory, InventorySchema } from 'src/inventory/inventory.entity';
import { InventoryService } from 'src/inventory/inventory.service';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
    ]),
    ProductModule,
    EquipmentModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
