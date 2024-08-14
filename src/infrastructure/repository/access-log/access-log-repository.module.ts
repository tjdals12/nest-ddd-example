import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessLogRepository } from './repository.interface';
import {
    AccessLog,
    AccessLogSchema,
    MongodbAccessLogRepository,
} from './mongodb';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: AccessLog.name, schema: AccessLogSchema },
        ]),
    ],
    providers: [
        {
            provide: AccessLogRepository,
            useClass: MongodbAccessLogRepository,
        },
    ],
    exports: [AccessLogRepository],
})
export class AccessLogRepositoryModule {}
