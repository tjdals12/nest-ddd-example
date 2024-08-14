import * as joi from 'joi';
import {
    CommonConfig,
    CommonConfigSchema,
    COMMON_CONFIG_KEY,
} from './common-config';
import {
    MysqlDatabaseConfig,
    MysqlDatabaseConfigSchema,
    MYSQL_DATABASE_CONFIG_KEY,
} from './mysql-database-config';
import {
    MongodbDatabaseConfig,
    MongodbDatabaseConfigSchema,
    MONGODB_DATABASE_CONFIG_KEY,
} from './mongodb-database-config';
import {
    CacheConfig,
    CacheConfigSchema,
    CACHE_CONFIG_KEY,
} from './cache-config';

export interface ConfigVariables {
    [COMMON_CONFIG_KEY]: CommonConfig;
    [MYSQL_DATABASE_CONFIG_KEY]: MysqlDatabaseConfig;
    [MONGODB_DATABASE_CONFIG_KEY]: MongodbDatabaseConfig;
    [CACHE_CONFIG_KEY]: CacheConfig;
}

export const validationSchema = joi.object({
    [COMMON_CONFIG_KEY]: CommonConfigSchema,
    [MYSQL_DATABASE_CONFIG_KEY]: MysqlDatabaseConfigSchema,
    [MONGODB_DATABASE_CONFIG_KEY]: MongodbDatabaseConfigSchema,
    [CACHE_CONFIG_KEY]: CacheConfigSchema,
});
