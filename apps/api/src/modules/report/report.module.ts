import {Module} from '@nestjs/common';
import {ReportController} from './report.controller';
import {ReportService} from './report.service';
import {PrismaModule} from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ReportController],
    providers: [ReportService],
    exports: [ReportService],
})
export class ReportModule {
}