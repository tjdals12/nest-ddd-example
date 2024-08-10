import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
    ConfigVariables,
    CONFIG_SERVICE_KEY,
    validationSchema,
} from '../interface';
import { COMMON_CONFIG_KEY } from '../interface/common-config';
import { DATABASE_CONFIG_KEY } from '../interface/database-config';
import { CACHE_CONFIG_KEY } from '../interface/cache-config';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `${__dirname}/.env.${process.env.NODE_ENV}`,
            load: [
                (): ConfigVariables => ({
                    [COMMON_CONFIG_KEY]: {
                        // eslint-disable-next-line
                        /** @ts-ignore */
                        NODE_ENV: process.env.NODE_ENV,
                        JWT_SECRET: process.env.JWT_SECRET,
                    },
                    [DATABASE_CONFIG_KEY]: {
                        DB_HOST: process.env.DB_HOST,
                        DB_PORT: +process.env.DB_PORT,
                        DB_NAME: process.env.DB_NAME,
                        DB_USER: process.env.DB_USER,
                        DB_PASS: process.env.DB_PASS,
                    },
                    [CACHE_CONFIG_KEY]: {
                        DB_HOST: process.env.CACHE_DB_HOST,
                        DB_PORT: +process.env.CACEH_DB_PORT,
                    },
                }),
            ],
            validationSchema,
            validationOptions: {
                abortEarly: true,
            },
        }),
    ],
    providers: [
        {
            provide: CONFIG_SERVICE_KEY,
            useClass: ConfigService,
        },
    ],
    exports: [CONFIG_SERVICE_KEY],
})
export class DotenvConfigModule {}
