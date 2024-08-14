import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { ConfigVariables } from '../interface';
import { COMMON_CONFIG_KEY } from '../interface/common-config';
import { MYSQL_DATABASE_CONFIG_KEY } from '../interface/mysql-database-config';
import { MONGODB_DATABASE_CONFIG_KEY } from '../interface/mongodb-database-config';
import { CACHE_CONFIG_KEY } from '../interface/cache-config';

export const loadConfigVariables = async (
    path: string,
): Promise<ConfigVariables> => {
    const client = new SecretsManagerClient({
        region: 'ap-northeast-2',
    });

    const response = await client.send(
        new GetSecretValueCommand({
            SecretId: path,
            VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
        }),
    );
    const secret = response.SecretString;
    const variables = JSON.parse(secret);

    return {
        [COMMON_CONFIG_KEY]: {
            // eslint-disable-next-line
            /** @ts-ignore */
            NODE_ENV: variables.NODE_ENV,
            JWT_SECRET: variables.JWT_SECRET,
        },
        [MYSQL_DATABASE_CONFIG_KEY]: {
            MYSQL_DB_HOST: variables.MYSQL_DB_HOST,
            MYSQL_DB_PORT: +variables.MYSQL_DB_PORT,
            MYSQL_DB_NAME: variables.MYSQL_DB_NAME,
            MYSQL_DB_USER: variables.MYSQL_DB_USER,
            MYSQL_DB_PASS: variables.MYSQL_DB_PASS,
        },
        [MONGODB_DATABASE_CONFIG_KEY]: {
            MONGO_DB_HOST: variables.MONGO_DB_HOST,
            MONGO_DB_PORT: +variables.MONGO_DB_PORT,
            MONGO_DB_NAME: variables.MONGO_DB_NAME,
            MONGO_DB_USER: variables.MONGO_DB_USER,
            MONGO_DB_PASS: variables.MONGO_DB_PASS,
        },
        [CACHE_CONFIG_KEY]: {
            CACHE_DB_HOST: variables.CACHE_DB_HOST,
            CACHE_DB_PORT: +variables.CACHE_DB_PORT,
        },
    };
};
