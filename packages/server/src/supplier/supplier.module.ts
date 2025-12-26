import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Supplier, SupplierSchema } from 'src/supplier/supplier.entity';
import { SupplierService } from 'src/supplier/supplier.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Supplier.name, schema: SupplierSchema },
    ]),
  ],
  controllers: [],
  providers: [SupplierService],
  exports: [SupplierService],
})
export class SupplierModule {}
