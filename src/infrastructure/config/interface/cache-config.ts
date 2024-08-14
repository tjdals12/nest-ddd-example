import * as joi from 'joi';

export interface CacheConfig {
    CACHE_DB_HOST: string;
    CACHE_DB_PORT: number;
}

export const CacheConfigSchema: { [k in keyof CacheConfig]: joi.AnySchema } = {
    CACHE_DB_HOST: joi.string().required(),
    CACHE_DB_PORT: joi.number().required(),
};

export const CACHE_CONFIG_KEY = 'CACHE_CONFIG';
