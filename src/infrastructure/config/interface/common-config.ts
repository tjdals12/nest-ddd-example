import * as joi from 'joi';

export interface CommonConfig {
    NODE_ENV: 'local' | 'development' | 'production';
    JWT_SECRET: string;
}

export const CommonConfigSchema: { [k in keyof CommonConfig]: joi.AnySchema } =
    {
        NODE_ENV: joi
            .valid('test', 'local', 'development', 'production')
            .required(),
        JWT_SECRET: joi.string().required(),
    };

export const COMMON_CONFIG_KEY = 'COMMON_CONFIG';
