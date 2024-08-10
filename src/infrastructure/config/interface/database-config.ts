import * as joi from 'joi';

export interface DatabaseConfig {
    DB_HOST: string;
    DB_PORT: number;
    DB_NAME: string;
    DB_USER: string;
    DB_PASS: string;
}

export const DatabaseConfigSchema: {
    [k in keyof DatabaseConfig]: joi.AnySchema;
} = {
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_NAME: joi.string().required(),
    DB_USER: joi.string().required(),
    DB_PASS: joi.string().required(),
};

export const DATABASE_CONFIG_KEY = 'DATABASE_CONFIG';
