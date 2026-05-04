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
import { MailerModule } from '@nestjs-modules/mailer/dist/mailer.module';
import { AuthModule } from 'src/auth/auth.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: 1000, // 1 minute window
        limit: 30, // 30 requests per minute globally
      },
      {
        name: 'auth',
        ttl: 10000, // 15 minute window
        limit: 5, // 5 attempts per 15 minutes for auth endpoints
      },
    ]),
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
    MailerModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // applies globally to all routes
    },
  ],
})
export class AppModule {}
