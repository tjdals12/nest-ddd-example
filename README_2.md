## Description <!-- omit in toc -->

A example of DDD(Domain Driven Development) implementation using nestjs framework

## Table of Contents <!-- omit in toc -->

-   [Core](#core)
    -   Exception Filter
    -   Interceptor
        -   http-logging.interceptor
        -   transform.interceptor
    -   Dto
        -   base-request.dto
        -   base-response.dto
    -   Decorator
        -   swagger.decorator
        -   request.decorator
-   [Application](#application)
    -   [Dto](#dto)
        -   request.dto
        -   response.dto
    -   [Controller](#controller)
    -   [Service](#service)
-   [Domain](#domain)
    -   [Entity](#entity)
    -   [Value Object](#value-object)
    -   [Service](#service)
    -   [Factory](#factory)
-   [Infrastructure](#infrastructure)
    -   [Config](#config)
        -   Variable Types & Schema
        -   Usage
        -   Using dotenv
    -   [Repository](#repository)
        -   Query Builder
        -   Repository Interface
        -   Using typeorm
            -   mysql
            -   mongodb
        -   Using sequalize
            -   mysql
        -   Using mongoose
            -   mongodb
        -   Usage
    -   more (third-party API, external API ...)

## Core

Core

## Application

Domain Layer와 Infrastructure Layer에서 제공하는 객체들을 조합하여 비즈니스 로직을 구현하는 Service, 요청/응답 값에 대한 타입을 정의하는 Dto, API를 정의하는 Controller가 위치하는 레이어 입니다.

### Dto

### Controller

### Service

## Domain

도메인과 관련된 객체들이 위치하는 레이어 입니다. 도메인 객체는 특징에 따라 Entity, Value Object로 분류하고 도메인과 관련된 로직을 담고 있는 Service, 도메인 객체를 생성하는 로직을 담고 있는 Factory로 구성됩니다.

### Entity

### Value Object

### Service

### Factory

## Infrastructure

외부에서 변수를 주입하고 관리하는 Config, 영속성을 관리하기 위한 Repository 등 인프라와 관련된 모듈이 위치하는 레이어 입니다. 여기서는 Config, Cache, Repository를 제공하지만 필요에 따라 Storage, Scheduler 등의 third-party API나 다른 서버의 API와 통신하는 부분이 추가될 수 있습니다.

### Config

외부로부터 주입 받는 변수에 대한 타입과 검증을 위한 스키마를 정의하고 변수를 관리하는 방법에 따라 모듈을 구현합니다. 여기서는 dotenv, GCP Secret Manager, AWS, Secret Manager를 통해 관리하는 변수를 로드하는 방법을 제공합니다.

#### Types & Schema

1. 변수에 대한 타입과 검증을 위한 스키마, ConfigService에서 접근하기 위한 키를 정의합니다.

    ```typescript
    import * as joi from 'joi';

    export interface YourConfig {
        property: string;
        ...
    }

    export const YourConfigSchema: { [k in keyof YourConfig]: joi.AnySchema } = {
        property: joi.string().required(),
        ...
    };

    export const YOUR_CONFIG_KEY = 'YOUR_CONFIG';
    ```

    아래의 코드는 데이터베이스에 대한 연결과 관련된 정보를 정의합니다.

    ##### `src/infrastructure/config/interface/database-config.ts`

    ```typescript
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
    ```

2. 정의한 타입과 스키마를 통합하고 ConfigService 주입에 사용할 키를 정의합니다.

    ##### `src/infrastructure/config/interface/index.ts`

    ```typescript
    import * as joi from 'joi';
    import {
        DatabaseConfig,
        DatabaseConfigSchema,
        DATABASE_CONFIG_KEY,
    } from './database-config';

    export interface ConfigVariables {
        [DATABASE_CONFIG_KEY]: DatabaseConfig;
    }

    export const validationSchema = joi.object({
        ...DatabaseConfigSchema,
    });

    export const CONFIG_SERVICE_KEY = 'CONFIG_SERVICE';
    ```

#### Using dotenv

1. src/infrastructure/config/dotenv에 .env 파일을 생성합니다.

    ##### `src/infrastructure/config/dotenv/.env`

    ```
    DB_HOST=localhost
    DB_PORT=3306
    DB_NAME=employees
    DB_USER=root
    DB_PASS=root
    ```

2. .env 파일을 빌드 결과물에 포함하기 위해서 nest-cli.json에 설정을 추가합니다. (자세한 설명은 [Nestjs 공식 문서](https://docs.nestjs.com/cli/monorepo#assets)를 확인하세요.)

    ##### `nest-cli.json`

    ```json
    {
        ...
        "compilerOptions": {
            ...
            "assets": [
                {
                    "include": "./infrastructure/config/**/.env*",
                    "outDir": "./dist/src"
                }
            ]
        }
    }
    ```

3. .env 파일에 정의한 변수를 사용하기 위한 설정을 추가합니다. Nestjs에서 제공하는 @nestjs/config 패키지를 통해 이를 쉽게 구현할 수 있습니다. (자세한 설명은 [Nestjs 공식 문서](https://docs.nestjs.com/techniques/configuration#configuration)를 확인하세요.)

    ##### `src/infrastructure/config/dotenv/dotenv-config.module.ts`

    ```typescript
    import * as joi from 'joi'는
    import { Global, Module } from '@nestjs/common';
    import { ConfigModule, ConfigService } from '@nestjs/config';

    import {
        ConfigVariables,
        CONFIG_SERVICE_KEY,
        validationSchema,
    } from '../interface';
    import { DATABASE_CONFIG_KEY, DatabaseConfigSchema } from '../interface/database-config';

    @Module({
        imports: [
            envFilePath: `${__dirname}/.env`,
            load: [
                (): ConfigVariables => ({
                    [DATABASE_CONFIG_KEY]: {
                        DB_HOST: process.env.DB_HOST,
                        DB_PORT: +process.env.DB_PORT,
                        DB_NAME: process.env.DB_NAME,
                        DB_USER: process.env.DB_USER,
                        DB_PASS: process.env.DB_PASS,
                    },
                })
            ],
            validationSchema,
        ],
        providers: [
            {
                provide: CONFIG_SERVICE_KEY,
                useClass: ConfigService,
            },
        ],
        exports: [CONFIG_SERVICE_KEY],
    })
    export class DotenvConfigModule {}
    ```

#### Usage

1. 사용할 모듈을 app.module에 추가합니다.

    ```typescript
    import { Module } from '@nestjs/common';
    import { DotenvConfigModule } from '@infrastructure/config/dotenv/dotenv-config.module';

    @Module({
        imports: [DotenvConfigModule],
    })
    export class AppModule {}
    ```

2. ConfigService를 주입할 때 사용한 키를 통해 ConfigService에 접근합니다. 아래는 모듈에서 접근하는 방법과 클래스에서 접근하는 방법입니다.

    모듈에서 접근하는 방법

    ```typescript
    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { CONFIG_SERVICE_KEY } from '@infrastructure/config/interface';
    import { ConfigService } from '@nestjs/config';
    import {
        DatabaseConfig,
        DATABASE_CONFIG_KEY,
    } from '@infrastructure/config/interface/database-config';

    @Module({
        imports: [
            TypeOrmModule.forRootAsync({
                inject: [CONFIG_SERVICE_KEY],
                useFactory: (configService: ConfigService) => {
                    const database =
                        configService.get<DatabaseConfig>(DATABASE_CONFIG_KEY);
                    return {
                        type: 'mysql',
                        host: database.DB_HOST,
                        port: database.DB_PORT,
                        database: database.DB_NAME,
                        username: database.DB_USER,
                        password: database.DB_PASS,
                    };
                },
            }),
        ],
    })
    export class RepositoryModule {}
    ```

    클래스에서 접근하는 방법

    ```typescript
    import { Injectable, Inject } from '@nestjs/common';
    import { ConfigService } from '@nestjs/config';
    import { CONFIG_SERVICE_KEY } from '@infrastructure/config/interface';
    import {
        COMMON_CONFIG_KEY,
        CommonConfig,
    } from '@infrastructure/config/interface/common-config';

    @Injectable()
    export class Service {
        constructor(
            @Inject(CONFIG_SERIVCE_KEY) private configService: ConfigService,
        ) {}

        setup() {
            const commonConfig =
                configService.get<CommonConfig>(COMMON_CONFIG_KEY);
            ...
        }
    }
    ```

### Repository

모델을 정의하고 데이터에 접근하기 위한 메소드를 제공합니다. 데이터베이스의 종류와 관계없이 비즈니스 로직에서 동일한 방식으로 데이터에 접근할 수 있도록 추상화된 Query Builder를 제공합니다.

#### Query Builder

Query Builder는 데이터베이스의 종류에 따라 달라질 수 있는 쿼리를 통합하기 위한 추상화된 객체 입니다. 또한, 쿼리에 사용할 수 있는 필드와 조건을 제한할 수 있기 때문에 비효율적인 쿼리를 생성하는 것을 방지할 수 있습니다.

아래의 코드는 Typeorm과 Mysql을 사용하는 예제입니다.

1. `QueryBuilder`에 쿼리에 사용할 수 있는 필드를 인스턴스 변수로 선언하고 `PropertyQuery`를 통해 사용할 수 있는 조건을 명시합니다.

    ##### `src/infrastructure/repository/employee/query-builder.interface.ts`

    ```typescript
    import { IPropertyQuery, PropertyQuery } from '../property-query';

    export class QueryBuilder {
        protected _employeeNo: IPropertyQuery<number, 'equals' | 'in'>;
        get employeeNo() {
            return this._employeeNo;
        }
        constructor() {
            this._employeeNo = new PropertyQuery();
        }
    }
    ```

2. 데이터베이스의 종류에 따라 QueryBuilder를 상속한 객체를 만들고 쿼리를 빌드하는 메소드를 정의합니다.

    ##### `src/infrastructure/repository/employee/mysql/employee.query-builder.ts`

    ```typescript
    import { Equal } from 'typeorm';
    import { QueryCondition } from '@infrastructure/repository/property-query';
    import { QueryBuilder } from '../query-builder.interface';
    import { Employee } from './employee.model';

    export class MysqlEmployeeQueryBuilder extends QueryBuilder {
        constructor() {
            super();
        }
        build(): QueryCondition<Employee, 'employeeNo'> {
            const query: ReturnType<typeof this.build> = {};
            if (this._employeeNo.type === 'equals') {
                query.employeeNo = Equal(this._employeeNo.value);
            }
            return query;
        }
    }
    ```

3. Repository에서 QueryBuilder를 반환하는 메소드와 QueryBuilder를 매개변수로 받는 메소드를 정의합니다. QueryBuilder의 build를 통해 데이터베이스에 맞는 쿼리를 생성합니다.

    ##### `src/infrastructure/repository/employee/mysql/employee.repository.ts`

    ```typescript
    import { Injectable } from '@nestjs/common';
    import { Employee as EmployeeEntity } from '@domain/employee/entity';
    import { QueryBuilder } from '../query-builder.interface';
    import { Employee as EmployeeModel } from './employee.model';
    import { MysqlEmployeeQueryBuilder } from './employee.query-builder';

    @Injectable()
    export class MysqlEmployeeRepository extends EmployeeRepository {
        getQueryBuilder(): QueryBuilder {
            return new MysqlEmployeeQueryBuilder();
        }
        async findOne(
            queryBuilder: MysqlEmployeeQueryBuilder,
        ): Promise<Employee> {
            const queryCondition = queryBuilder.build();
            const model = await EmployeeModel.findOneBy(queryCondition);
            if (model === null) return null;
            return this.toEntity(model);
        }
        private toEntity(model: EmployeeModel): EmployeeEntity {
            return new EmployeeEntity({ ... });
        }
    }
    ```

4. 비즈니스 로직에서는 QueryBuilder를 통해 쿼리 조건을 설정합니다.

    ```typescript
    const queryBuilder = this.employeeRepository.getQueryBuilder();
    queryBuilder.employeeNo.equals(employeeNo);

    const employee = await this.employeeRepository.findOne(queryBuilder);
    ```

#### Repository Interface

Repository Interface는 Repository를 사용하는 로직이 의존하는 추상화된 객체 입니다.
데이터베이스의 변경에 영향을 받지 않고 동일한 방식으로 Repository를 사용할 수 있습니다. 또한, Repository Interface는 Domain 객체를 반환하도록 설계함으로써 모델과의 의존성을 갖지 않습니다.

아래의 코드는 Typeorm과 Mysql을 사용하는 예제입니다.

1.  인터페이스를 정의합니다. 모듈에 Providers로 제공해야 하기 때문에 interface 대신 abstract class를 사용합니다.

    ##### `src/infrastructure/repository/employee/repository.interface.ts`

    ```typescript
    import { Employee } from '@domain/employee/entity';
    import { QueryBuilder } from './query-builder.interface';

    export abstract class EmployeeRepository {
        abstract getQueryBuilder(): QueryBuilder;
        abstract findOne(queryBuilder: QueryBuilder): Promise<Employee>;
    }
    ```

2.  모델과 인터페이스를 구현하는 객체를 정의합니다.

    ##### `src/infrastructure/repository/employee/mysql/employee.model.ts`

    ```typescript
    import {
        Entity,
        Column,
        PrimaryGeneratedColumn,
        BaseEntity,
    } from 'typeorm';

    @Entity({ name: 'employees' })
    export class Employee extends BaseEntity {
        @PrimaryGeneratedColumn({ name: 'emp_no' })
        employeeNo: number;
        @Column()
        firstName: string;
        @Column()
        lastName: string;
    }
    ```

    ##### `src/infrastructure/repository/employee/mysql/employee.repository.ts`

    ```typescript
    import { Injectable } from '@nestjs/common';
    import { Employee as EmployeeEntity } from '@domain/employee/entity';
    import { QueryBuilder } from '../query-builder.interface';
    import { Employee as EmployeeModel } from './employee.model';
    import { MysqlEmployeeQueryBuilder } from './employee.query-builder';

    @Injectable()
    export class MysqlEmployeeRepository extends EmployeeRepository {
        getQueryBuilder(): QueryBuilder {
            return new MysqlEmployeeQueryBuilder();
        }
        async findOne(
            queryBuilder: MysqlEmployeeQueryBuilder,
        ): Promise<Employee> {
            const queryCondition = queryBuilder.build();
            const model = await EmployeeModel.findOneBy(queryCondition);
            if (model === null) return null;
            return this.toEntity(model);
        }
        private toEntity(model: EmployeeModel): EmployeeEntity {
            return new EmployeeEntity({ ... });
        }
    }
    ```

3.  모듈을 만들고 모델과 레포지토리를 추가합니다.

    ##### `src/infrastructure/repository/employee/employee.repository.ts`

    ```typescript
    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { Employee, MysqlEmployeeRepository } from './mysql';
    import { EmployeeRepository } from './repository.interface';

    @Module({
        imports: [TypeOrmModule.forFeature([Employee])],
        providers: [
            {
                provide: EmployeeRepository,
                useClass: MysqlEmployeeRepository,
            },
        ],
        exports: [EmployeeRepository],
    })
    export class EmployeeRepositoryModule {}
    ```

#### Using Typeorm

#### Using Sequalize

#### Using Mongoose
