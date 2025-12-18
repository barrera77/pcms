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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || ''),
    ProvinceModule,
    CityModule,
    AreaModule,
    EmployeeModule,
    DepartmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
