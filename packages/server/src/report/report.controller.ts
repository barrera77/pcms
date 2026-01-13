import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReportService } from 'src/report/report.service';

@ApiTags('Reports')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
}
