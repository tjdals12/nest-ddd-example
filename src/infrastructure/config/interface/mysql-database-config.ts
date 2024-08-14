import * as joi from 'joi';

export interface MysqlDatabaseConfig {
    MYSQL_DB_HOST: string;
    MYSQL_DB_PORT: number;
    MYSQL_DB_NAME: string;
    MYSQL_DB_USER: string;
    MYSQL_DB_PASS: string;
}

export const MysqlDatabaseConfigSchema: {
    [k in keyof MysqlDatabaseConfig]: joi.AnySchema;
} = {
    MYSQL_DB_HOST: joi.string().required(),
    MYSQL_DB_PORT: joi.number().required(),
    MYSQL_DB_NAME: joi.string().required(),
    MYSQL_DB_USER: joi.string().required(),
    MYSQL_DB_PASS: joi.string().required(),
};

export const MYSQL_DATABASE_CONFIG_KEY = 'MYSQL_DATABASE_CONFIG';
