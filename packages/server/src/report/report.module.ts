import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeModule } from 'src/employee/employee.module';
import { JobModule } from 'src/job/job.module';
import { PestModule } from 'src/pest/pest.module';
import { Report, ReportSchema } from 'src/report/report.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    JobModule,
    EmployeeModule,
    PestModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class ReportModule {}
