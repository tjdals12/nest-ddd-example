import * as joi from 'joi';

export interface CacheConfig {
    DB_HOST: string;
    DB_PORT: number;
}

export const CacheConfigSchema: { [k in keyof CacheConfig]: joi.AnySchema } = {
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
};

export const CACHE_CONFIG_KEY = 'CACHE_CONFIG';
