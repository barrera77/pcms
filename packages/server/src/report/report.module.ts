import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BuildingModule } from 'src/building/building.module';
import { CityModule } from 'src/city/city.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { PestModule } from 'src/pest/pest.module';
import { Report, ReportSchema } from 'src/report/report.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    CityModule,
    BuildingModule,
    EmployeeModule,
    PestModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class ReportModule {}
