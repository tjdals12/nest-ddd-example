import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
    CommonConfig,
    COMMON_CONFIG_KEY,
} from '@infrastructure/config/interface/common-config';
import {
    MysqlDatabaseConfig,
    MYSQL_DATABASE_CONFIG_KEY,
} from '@infrastructure/config/interface/mysql-database-config';
import { MongooseModule } from '@nestjs/mongoose';
import {
    MONGODB_DATABASE_CONFIG_KEY,
    MongodbDatabaseConfig,
} from '@infrastructure/config/interface/mongodb-database-config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const common =
                    configService.get<CommonConfig>(COMMON_CONFIG_KEY);
                const database = configService.get<MysqlDatabaseConfig>(
                    MYSQL_DATABASE_CONFIG_KEY,
                );
                return {
                    type: 'mysql',
                    host: database.MYSQL_DB_HOST,
                    port: database.MYSQL_DB_PORT,
                    database: database.MYSQL_DB_NAME,
                    username: database.MYSQL_DB_USER,
                    password: database.MYSQL_DB_PASS,
                    autoLoadEntities: true,
                    logging: common.NODE_ENV !== 'production',
                };
            },
        }),
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const database = configService.get<MongodbDatabaseConfig>(
                    MONGODB_DATABASE_CONFIG_KEY,
                );
                return {
                    // uri: `mongodb://${database.MONGO_DB_USER}:${database.MONGO_DB_PASS}@${database.MONGO_DB_HOST}:${database.MONGO_DB_PORT}/${database.MONGO_DB_NAME}`,
                    uri: `mongodb://${database.MONGO_DB_HOST}:${database.MONGO_DB_PORT}`,
                    dbName: database.MONGO_DB_NAME,
                    auth: {
                        username: database.MONGO_DB_USER,
                        password: database.MONGO_DB_PASS,
                    },
                    authSource: 'admin',
                };
            },
        }),
    ],
})
export class RepositoryModule {}
