import * as joi from 'joi';

export interface MongodbDatabaseConfig {
    MONGO_DB_HOST: string;
    MONGO_DB_PORT: number;
    MONGO_DB_NAME: string;
    MONGO_DB_USER: string;
    MONGO_DB_PASS: string;
}

export const MongodbDatabaseConfigSchema: {
    [k in keyof MongodbDatabaseConfig]: joi.AnySchema;
} = {
    MONGO_DB_HOST: joi.string().required(),
    MONGO_DB_PORT: joi.number().required(),
    MONGO_DB_NAME: joi.string().required(),
    MONGO_DB_USER: joi.string().required(),
    MONGO_DB_PASS: joi.string().required(),
};

export const MONGODB_DATABASE_CONFIG_KEY = 'MONGODB_DATABASE_CONFIG';
