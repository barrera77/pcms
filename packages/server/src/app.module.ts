import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AreaModule } from 'src/area/area.module';
import { CityModule } from 'src/city/city.module';
import { ProvinceModule } from 'src/province/province.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { DepartmentModule } from 'src/department/department.module';
import { EquipmentModule } from 'src/equipment/equipment.module';
import { InventoryModule } from 'src/inventory/inventory.module';
import { ProductModule } from 'src/product/product.module';
import { PestModule } from 'src/pest/pest.module';
import { BuildingModule } from 'src/building/building.module';
import { UserModule } from 'src/user/user.module';
import { SupplierModule } from 'src/supplier/supplier.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || ''),
    ProvinceModule,
    CityModule,
    AreaModule,
    EmployeeModule,
    DepartmentModule,
    EquipmentModule,
    InventoryModule,
    ProductModule,
    PestModule,
    BuildingModule,
    UserModule,
    SupplierModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
