import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config({
    path: `${__dirname}/.env.migration`,
});

export const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    entities: ['src/**/infrastructure/repository/**/*.model.ts'],
    migrationsTableName: 'migrations',
    migrations: [`${__dirname}/[!data-source]*.ts`],
});
