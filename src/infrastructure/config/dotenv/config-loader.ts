import { Injectable } from '@nestjs/common';
import { ConfigVariables } from '../interface';
import { config } from 'dotenv';
import { COMMON_CONFIG_KEY } from '../interface/common-config';
import { MYSQL_DATABASE_CONFIG_KEY } from '../interface/mysql-database-config';
import { MONGODB_DATABASE_CONFIG_KEY } from '../interface/mongodb-database-config';
import { CACHE_CONFIG_KEY } from '../interface/cache-config';
import { ConfigLoader } from '../interface';

@Injectable()
export class DotenvLoader extends ConfigLoader {
    private readonly path = `${__dirname}/.env.${process.env.NODE_ENV}`;

    async load(): Promise<ConfigVariables> {
        config({ path: this.path });

        return {
            [COMMON_CONFIG_KEY]: {
                // eslint-disable-next-line
                /** @ts-ignore */
                NODE_ENV: process.env.NODE_ENV,
                JWT_SECRET: process.env.JWT_SECRET,
            },
            [MYSQL_DATABASE_CONFIG_KEY]: {
                MYSQL_DB_HOST: process.env.MYSQL_DB_HOST,
                MYSQL_DB_PORT: +process.env.MYSQL_DB_PORT,
                MYSQL_DB_NAME: process.env.MYSQL_DB_NAME,
                MYSQL_DB_USER: process.env.MYSQL_DB_USER,
                MYSQL_DB_PASS: process.env.MYSQL_DB_PASS,
            },
            [MONGODB_DATABASE_CONFIG_KEY]: {
                MONGO_DB_HOST: process.env.MONGO_DB_HOST,
                MONGO_DB_PORT: +process.env.MONGO_DB_PORT,
                MONGO_DB_NAME: process.env.MONGO_DB_NAME,
                MONGO_DB_USER: process.env.MONGO_DB_USER,
                MONGO_DB_PASS: process.env.MONGO_DB_PASS,
            },
            [CACHE_CONFIG_KEY]: {
                CACHE_DB_HOST: process.env.CACHE_DB_HOST,
                CACHE_DB_PORT: +process.env.CACHE_DB_PORT,
            },
        };
    }
}
