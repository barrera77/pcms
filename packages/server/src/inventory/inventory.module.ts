import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventory, InventorySchema } from 'src/inventory/inventory.entity';
import { InventoryService } from 'src/inventory/inventory.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
    ]),
  ],
  controllers: [],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
