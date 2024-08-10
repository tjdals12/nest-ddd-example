import * as joi from 'joi';
import {
    CommonConfig,
    CommonConfigSchema,
    COMMON_CONFIG_KEY,
} from './common-config';
import {
    DatabaseConfig,
    DatabaseConfigSchema,
    DATABASE_CONFIG_KEY,
} from './database-config';
import {
    CacheConfig,
    CacheConfigSchema,
    CACHE_CONFIG_KEY,
} from './cache-config';

export interface ConfigVariables {
    [COMMON_CONFIG_KEY]: CommonConfig;
    [DATABASE_CONFIG_KEY]: DatabaseConfig;
    [CACHE_CONFIG_KEY]: CacheConfig;
}

export const validationSchema = joi.object({
    ...CommonConfigSchema,
    ...DatabaseConfigSchema,
    ...CacheConfigSchema,
});

export const CONFIG_SERVICE_KEY = 'CONFIG_SERVICE';
