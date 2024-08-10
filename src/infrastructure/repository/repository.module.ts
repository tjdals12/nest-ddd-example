import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CONFIG_SERVICE_KEY } from '@infrastructure/config/interface';
import { ConfigService } from '@nestjs/config';
import {
    CommonConfig,
    COMMON_CONFIG_KEY,
} from '@infrastructure/config/interface/common-config';
import {
    DatabaseConfig,
    DATABASE_CONFIG_KEY,
} from '@infrastructure/config/interface/database-config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [CONFIG_SERVICE_KEY],
            useFactory: (configService: ConfigService) => {
                const common =
                    configService.get<CommonConfig>(COMMON_CONFIG_KEY);
                const database =
                    configService.get<DatabaseConfig>(DATABASE_CONFIG_KEY);
                return {
                    type: 'mysql',
                    host: database.DB_HOST,
                    port: database.DB_PORT,
                    database: database.DB_NAME,
                    username: database.DB_USER,
                    password: database.DB_PASS,
                    autoLoadEntities: true,
                    logging: common.NODE_ENV !== 'production',
                };
            },
        }),
    ],
})
export class RepositoryModule {}
