import { AccessLogRepositoryModule } from '@infrastructure/repository/access-log/access-log-repository.module';
import { Module } from '@nestjs/common';
import { AccessLogApplicationService } from './access-log-application.service';
import { AccessLogApplicationController } from './access-log-application.controller';

@Module({
    imports: [AccessLogRepositoryModule],
    providers: [AccessLogApplicationService],
    controllers: [AccessLogApplicationController],
})
export class AccessLogApplicationModule {}
