## Description <!-- omit in toc -->

A example of DDD(Domain Driven Development) implementation using nestjs framework

## Table of Contents <!-- omit in toc -->

-   [Application](#application)
    -   [DTO](#application-dto)
    -   [Service](#application-service)
    -   [Controller](#application-controller)
    -   [Structure](#application-structure)
-   [Domain](#domain)
    -   [Entity](#domain-entity)
    -   [Value Object](#domain-value-object)
    -   [Service](#domain-service)
    -   [Structure](#domain-structure)
-   [Infrastructure](#infrastructure)
    -   [Config](#infrastructure-config)
        -   [Types & Validation](#infrastructure-config-types-validation)
        -   [Structure](#infrastructure-config-structure)
        -   [Usage](#infrastructure-config-usage)
    -   [Repository](#infrastructure-repository)
        -   [Query Builder](#repository-query-builder)
        -   [Structure](#repository-structure)
        -   [Usage](#repository-usage)
        -   [Mutiple Database](#mutiple-database)

## Application

API 정의, 비즈니스 로직 등이 위치하는 레이어이다.

<div id="application-dto"></div>

### DTO

요청/응답 값에 대한 타입을 정의하고 검증을 수행한다. 또한 문서화를 위한 타입을 제공한다.

요청 값은 class-validator와 class-transformer를 통해 검증을 수행하고 알맞은 타입으로 변환한다.

응답 값은 API의 리턴 값을 정의한다. 도메인과 관련된 정보를 반환할 때 유용하다. 도메인 객체는 도메인과 관련된 중요한 규칙을 다루는 로직을 포함하고 있기 때문에 비즈니스 로직에서만 다루어야 한다. 비즈니스 로직이 도메인과 관련된 정보를 반환해야 하는 경우 데이터만을 담고 있는 DTO를 사용해야 한다.

example:

```typescript
/** dto/request.dto */
export class CreateEmployeeDto {
    @IsString()
    @MinLength(2)
    @MaxLength(16)
    firstName: string;

    @IsString()
    @MinLength(2)
    @MaxLength(16)
    lastName: string;

    @Type(() => Date)
    @IsDate()
    hireDate: Date;
}

/** dto/response.dto */
export class EmployeeDto {
    employeeNo: number;
    firstName: string;
    lastName: string;
    hireDate: Date;
    constructor(entity: Employee) {
        this.employeeNo = entity.employeeNo;
        this.firstName = entity.firstName;
        this.lastName = entity.lastName;
        this.hireDate = entity.hireDate;
    }
}
```

<div id="application-service"></div>

### Service

도메인 계층과 인프라 계층을 조합하여 비즈니스 로직을 구현한다. Service는 특정 도메인에 한정된 로직을 제공하는 것이 아니라 여러 도메인 객체와 인프라 기능을 조합하여 애플리케이션이 요구하는 기능을 구현한다. 그렇기 때문에 이곳에는 주로 통합 테스트를 작성한다.

example:

```typescript
@Injectable()
export class EmployeeService {
    constructor(
        private employeeDomainFactory: EmployeeDomainFactory,
        private departmentEmployeeDomainFactory: DepartmentEmployeeDomainFactory,
    ) {}

    async create(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeDto> {
        let employee: Employee = null;
        try {
            employee = this.employeeDomainFactory.create(createEmployeeDto);
        } catch {
            throw new BadRequestException();
        }
        try {
            employee = await this.employeeRepository.save(employee);
        } catch {
            throw new InternalServerErrorException();
        }
        const employeeDto = new EmployeeDto(employee);
        return employeeDto;
    }

    async changeDepartment(
        employeeNo: number,
        changeDepartmentDto: ChangeDepartmentDto,
    ): Promise<EmployeeDto> {
        const queryBuilder = this.employeeRepository.getQueryBuilder();
        queryBuilder.employeeNo.equals(employeeNo);
        const employee = await this.employeeRepository.findOne(queryBuilder);
        if (employee === null) throw new NotFoundException();
        try {
            const departmentEmployee =
                await this.departmentEmployeeDomainFactory.create(
                    changeDepartmentDto,
                );
            employee.changeDepartment(departmentEmployee);
        } catch {
            throw new BadRequestException();
        }
        try {
            await this.employeeRepository.update(employee);
        } catch {
            throw new InternalServerErrorException();
        }
        const employeeDto = new EmployeeDto(employee);
        return employeeDto;
    }
}
```

<div id="application-controller"></div>

### Controller

API에 대해 정의하고 명세를 제공한다. Controller는 오직 Service에만 의존해야 한다. 도메인 계층과 인프라 계층(특히, 레포지토리)에 의존한다면 비즈니스 로직이 여러 곳에 분산될 수 있다.

하지만 도메인과 무관한 관심사에 대해서는 인프라 계층에 대해 직접적인 의존성을 가질 수 있다. 예를 들어, API 엑세스 로그를 남겨야 하는 기능을 구현해야 한다면 이는 도메인과 무관하기 때문에 도메인 객체가 필요하지 않고 단순히 저장과 조회 기능만을 제공한다. 이럴 때는 레포지토리에 직접 접근하여 사용해도 문제가 되지 않는다.

example:

```typescript
@Controller()
export class EmployeeController {
    constructor(private employeeService: EmployeeService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '사원 추가', description: '사원 추가' })
    @ApiBearerAuth()
    @ApiBaseResponse({
        status: HttpStatus.OK,
        type: EmployeeDto,
    })
    @ApiBadRequestException()
    @ApiUnauthorizedException()
    async create(@Body() createEmployeeDto: CreateEmployeeDto) {
        return this.employeeApplicationService.create(createEmployeeDto);
    }

    @Patch('/:employeeNo/department')
    @ApiOperation({ summary: '부서 변경', description: '부서 변경' })
    @ApiBearerAuth()
    @ApiBaseResponse({
        status: HttpStatus.OK,
        type: EmployeeDto,
    })
    @ApiBadRequestException()
    @ApiUnauthorizedException()
    @ApiNotFoundException()
    async changeDepartment(
        @Param('employeeNo') employeeNo: number,
        @Body() changeDepartmentDto: ChangeDepartmentDto,
    ) {
        return this.employeeApplicationService.changeDepartment(
            employeeNo,
            changeDepartmentDto,
        );
    }
}
```

<div id="application-structure"></div>

### Structure

```
./application
└── [domain_name]
    ├── dto
    │   ├── request.dto.ts
    │   └── response.dto.ts
    ├── [domain_name]-application.controller.ts
    ├── [domain_name]-application.module.ts
    ├── [domain_name]-application.service.ts
    └── [domain_name]-application.spec.ts
```

## Domain

도메인과 관련된 객체들이 위치하는 레이어이다. 도메인 객체는 도메인과 관련된 중요한 규칙을 포함하고 있으며 특징에 따라 Entity, Value Object, Factory, Service로 분류된다. 이곳에는 주로 유닛 테스트를 작성한다.

<div id="domain-entity"></div>

### Entity

Entity는 자신의 생명주기 동안 형태와 내용이 급격하게 바뀔수도 있지만 연속성은 유지해야 한다. 그렇기 때문에 객체의 형태와 이력에 관계없이 각 객체를 구별하는 수단을 정의해야 한다. 이러한 식별성은 데이터의 특정 속성이나 여러 속성의 조합으로 나타내기도 한다. 또는 데이터의 속성으로 구성되는 실질적인 고유키가 없다면 숫자나 문자열과 같은 유일한 값을 추가하여 나타내기도 하는데 이러한 ID 값은 애플리케이션에 따라서 사용자에게 보여지지 않을 수도 있다.

Entity는 속성이 같지 않아도 고유한 키를 통해 서로 동일한 것으로 나타낸다. 예를 들어 사원과 부서라는 Entity가 있다고 가정해보자. 사원은 사원 번호가 고유한 키 값이고 직급, 이름, 성별, 연락처 등의 속성이 있을 수 있다. 부서는 부서 번호가 고유한 키 값 이고 부서 이름, 부서 생성일 등의 속성이 있을 수 있다.

```typescript
// employee/entity/employee.ts
export class Employee {
    employeeNo: string;
    name: string;
    title: string;
    gender: string;
    contract: string;
}

// department/entity/department.ts
export class Department {
    departmentNo: string;
    name: string;
    createdAt: Date;
}
```

부서에 속해 있는 사원 목록을 조회하기 위해서 부서에 사원 목록 속성을 추가한다. 근데 필요한 정보는 사원 번호와 이름이라고 했을 때 별도의 엔티티를 추가할 수 있다. 이 엔티티는 사원 Entity와는 속성이 다르지만 사원 번호를 통해 식별이 가능하기 때문에 둘은 개념적으로 동일하다.

어떤 Entity가 다른 Entity를 참조해야 할 때 동일하게 식별할 수만 있다면 필요한 속성만 정의한 새로운 Entity를 만들어서 참조하는 방식을 사용할 수도 있다.

```typescript
// department/entity/department-employee.ts
export class DepartmentEmployee {
    employeeNo: string;
    name: string;
}

// department/entity/department.ts
export class Department {
    departmentNo: string;
    name: string;
    createdAt: Date;
    employees: DepartmentEmployee[];
}
```

하지만 이러한 방식을 영속성과 관련지어 생각하면 안된다. DepartmentEmployee라는 새로운 Entity가 추가 되었다고 해서 데이터베이스에 이와 관련된 새로운 테이블을 추가되어야 하는 것은 아니기 때문이다.

<div id="domain-value-object"></div>

### Value Object

Value Object는 개념적 식별성을 갖지 않으면서 도메인의 서술적 측면(사물 또는 사물의 어떤 특징)을 나타낸다. Value Object는 어떤 요소의 속성에만 관심이 있기 때문에 어떤 식별성도 부여하지 않는다. 그래서 Value Objects는 Entity를 유지하는 데 필요한 설계상의 복잡성을 낮출 수 있다.

Value Object의 형태는 단순할 수도 있지만 다른 여러 객체를 조립한 것일 수도 있고 Entity를 참조할 수도 있다. 또한 Value Object는 여러 객체 간에 오가는 메시지의 매개변수로 전달되기도 하며 특정 연산에서 사용하기 위한 목적으로만 생성되기도 하고 Entity의 속성으로 사용되기도 한다.

```typescript
// person/vo/name.ts
export class Name {
    readonly firstName: string;
    readonly lastName: string;
}

// person/vo/address.ts
export class Address {
    readonly province: string;
    readonly city: string;
    readonly district: string;
    readonly street: string;
    readonly buildingNumber: number;
    readonly zipCode: string;
}

// person/entity/person.ts
export class Person {
    id: string;
    name: Name;
    address: Address;
}
```

Value Object를 다른 여러 객체에서 사용하기 위해서 사본을 만들거나 공유하는 방식을 사용한다. 사본은 Value Object를 공유하기 위한 가장 단순한 방법이지만 많은 리소스를 차지할 수 있다. 공유는 하나의 인스턴스를 여러 객체에서 참조하는 방식으로 최적화할 수 있지만 변경 사항이 여러 객체에게 영향을 끼칠 수 있기 때문에 불변적으로 다루어야 한다.

Value Object는 경우에 따라서 값을 변경하는 것을 허용할 수 있지만 이렇게 되면 공유해서는 안된다. Value Object는 가급적 변하지 않게 설계해야 한다. 그래야 다루기 쉽고 설계가 단순해지기 때문이다.

<div id="domain-service"></div>

### Service

Service는 특정 Entity나 Value Object에서 찾기 힘든 중요한 도메인 연산을 나타낸다. 도메인 연산은 보통 여러 도메인 객체를 모아 그것들을 조율해 발생하는 어떤 활동이나 행동이다. 이러한 연산을 여러 도메인 객체에 퍼뜨리면 서로에 대한 의존성을 생기고 단독으로 이해할 수 있는 개념을 복잡하게 만든다. 또한 여러 도메인 객체에 분산되면 도메인 객체의 책임이 세밀해지기 때문에 도메인 규칙이 응용 계층에 쉽게 노출될 수 있다. Service는 다른 도메인 객체와 달리 상태를 캡슐화 하지 않고 매개변수와 결과로 도메인 객체를 사용한다.

Service를 적절히 도입하면 응용 계층과 같이 도메인 계층과 상호작용하는 게층과의 경계를 선명하게 하는데 도움이 될 수 있다. 간혹 도메인 계층의 서비스와 응용 계층의 서비스를 동일하게 생각하기도 하는데 이를 분명하게 구분할 필요가 있다.

<div id="domain-structure"></div>

### Structure

```
└── domain
    ├── [domain_name]-domain.module.ts
    ├── entity
    │   ├── [domain_name]-domain.entity.spec.ts
    │   ├── [domain_name]-domain.entity.ts
    │   └── index.ts
    ├── factory
    │   ├── [domain_name]-domain.factory.ts
    │   └── index.ts
    └── service
        ├── [domain_name]-domain.service.spec.ts
        ├── [domain_name]-domain.service.ts
        └── index.ts
```

## Infrastructure

환경 변수 관리, 영속성 관리, 캐시, third-party API 등 인프라와 관련된 모듈이 위치하는 레이어이다.

<div id="config"></div>

### Config

환경 변수 관리를 위한 코드가 위치한다. Dotenv, GCP Secret Manager, AWS Secret Manager 등에 저장된 환경 변수를 로드하고 타입과 값을 검증한다.

<div id="infrastructure-config-types-validation"></div>

#### Types & Validation

변수의 타입과 검증을 위한 스키마를 정의한다. 이러한 타입 정의를 통해 변수가 추가되거나 변경될 때 코드가 수정되도록 강제할 수 있다. 검증 스키마는 joi를 사용하지만 필요한 경우 class-validator를 사용할 수 있다.

검증 스키마는 타입 정의를 따르도록 하여 변수가 추가되거나 변경될 때 스키마를 수정하도록 강제할 수 있다.

모든 변수에 대한 타입과 스키마에 대한 정의를 하나의 파일에 선언할 수 있지만 가독성을 위해서 변수가 사용되는 용도에 맞게 파일을 분리한다. 이렇게 나누어진 타입과 스키마를 index.js에서 통합한다.

example:

```typescript
/** interface/common-config.ts */
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

/** interface/database-config.ts */
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

/** interface/index.js */
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

export interface ConfigVariables {
    [COMMON_CONFIG_KEY]: CommonConfig;
    [DATABASE_CONFIG_KEY]: DatabaseConfig;
}

export const validationSchema = joi.object({
    [COMMON_CONFIG_KEY]: CommonConfigSchema,
    [DATABASE_CONFIG_KEY]: DatabaseConfigSchema,
});
```

검증은 모듈에서 수행한다. 이는 변수를 관리하는 방식이 변경되어 새로운 loader를 추가할 때 검증이 누락되는 일이 발생하지 않는다.

example:

```typescript
/** config.module.ts */
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { validationSchema } from './interface';
import { ConfigLoader } from './interface';
import { DotenvLoader } from './dotenv';

@Global()
@Module({
    providers: [
        {
            provide: ConfigLoader,
            useClass: DotenvLoader,
            // useClass: GCPSecretManager,
            // useClass: AWSSecretManager,
        },
        {
            provide: ConfigService,
            inject: [ConfigLoader],
            useFactory: async (configLoader: ConfigLoader) => {
                const configVariables = await configLoader.load();
                const { error, value: validatedConfigVariables } =
                    validationSchema.validate(configVariables, {
                        abortEarly: true,
                    });
                if (error) {
                    throw new Error(
                        `Config validation error: ${error.message}`,
                    );
                }
                return new ConfigService(validatedConfigVariables);
            },
        },
    ],
    exports: [ConfigService],
})
export class ConfigModule {}
```

<div id="infrastructure-config-structure"></div>

#### Structure

```
config
├── dotenv
│   ├── .env
│   ├── config-loader.ts
│   └── index.ts
├── aws-secret-manager
│   ├── config-loader.ts
│   └── index.ts
├── gcp-secret-manager
│   ├── config-loader.ts
│   └── index.ts
└── interface
│   ├── common-config.ts
│   ├── database-config.ts
│   ├── ...others-config
│   └── index.ts
└── config-module.ts
```

<div id="infrastructure-config-usage"></div>

#### Usage

관리할 변수에 대한 타입과 스키마를 정의하고 환경 변수를 관리하는 방법에 맞게 Loader 클래스를 구현한다. Loader 클래스는 ConfigLoader 인터페이스를 구현해야 하고 이를 통해 변수가 누락되는 것을 방지할 수 있다.

구현한 Loader 클래스를 ConfigModule에 추가하면 ConfigService를 주입할 때 변수를 로드하고 검증을 수행한다.

dotenv를 사용하여 데이터베이스와 관련된 환경 변수를 로드하는 예제는 아래와 같이 구현할 수 있다.

example:

```typescript
/** interface/database-config.ts */
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

/** interface/index.ts */
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
    [DATABASE_CONFIG_KEY]: DatabaseConfigSchema,
});

export abstract class ConfigLoader {
    abstract load(): Promise<ConfigVariables>;
}

export const DATABASE_CONFIG_KEY = 'DATABASE_CONFIG';

/** dotenv/config-loader.ts */
import { Injectable } from '@nestjs/common';
import { ConfigVariables } from '../interface';
import { config } from 'dotenv';
import { DATABASE_CONFIG_KEY } from '../interface/mysql-database-config';
import { ConfigLoader } from '../interface';

@Injectable()
export class DotenvLoader extends ConfigLoader {
    private readonly path = `${__dirname}/.env.${process.env.NODE_ENV}`;

    async load(): Promise<ConfigVariables> {
        config({ path: this.path });

        return {
            [DATABASE_CONFIG_KEY]: {
                DB_HOST: process.env.DB_HOST,
                DB_PORT: +process.env.DB_PORT,
                DB_NAME: process.env.DB_NAME,
                DB_USER: process.env.DB_USER,
                DB_PASS: process.env.DB_PASS,
            },
        };
    }
}

/** config-module.ts */
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { validationSchema } from './interface';
import { ConfigLoader } from './interface';
import { DotenvLoader } from './dotenv';

@Global()
@Module({
    providers: [
        {
            provide: ConfigLoader,
            useClass: DotenvLoader,
        },
        {
            provide: ConfigService,
            inject: [ConfigLoader],
            useFactory: async (configLoader: ConfigLoader) => {
                const configVariables = await configLoader.load();
                const { error, value: validatedConfigVariables } =
                    validationSchema.validate(configVariables, {
                        abortEarly: true,
                    });
                if (error) {
                    throw new Error(
                        `Config validation error: ${error.message}`,
                    );
                }
                return new ConfigService(validatedConfigVariables);
            },
        },
    ],
    exports: [ConfigService],
})
export class ConfigModule {}
```

환경 변수가 필요한 부분에서는 ConfigService를 통해 접근할 수 있다.

example:

```typescript
/** service */
@Injectable()
export class Service {
    constructor(private configService: ConfigService) {}

    async foo() {
        const databaseConfig = this.configService.get<DatabaseConfig>(DATABASE_CONFIG_KEY);
        ...
    }
}

/** module */
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const databaseConfig = this.configService.get<DatabaseConfig>(DATABASE_CONFIG_KEY);
                ...
            }
        })
    ]
})
export class RepositoryModule {}
```

<div id="repository"></div>

### Repository

영속성 관리를 위한 코드가 위치한다. 데이터베이스에 대한 연결, 모델에 대한 정의, 데이터베이스에 접근하기 위한 메소드를 제공한다.

<div id="repository-query-builder"></div>

#### Query Builder

쿼리는 사용하는 ORM(typeorm, sequalize, mongoose 등) 또는 Sql, NoSql에 따라 달라지게 된다. 이러한 문법이 외부에 노출되면 비즈니스 로직과는 무관한 변경 사항(이를 테면 데이터베이스 종류의 변경, ORM 변경 등)이 비즈니스 로직에 영향을 미칠 수 있다.

Query Builder는 ORM이나 데이터베이스의 종류에 따라 달라지는 쿼리를 통합하기 위해서 사용한다. 또한 쿼리에 사용할 수 있는 필드와 검색 조건을 제한할 수 있다.

먼저, 쿼리에 사용할 수 있는 필드와 검색 조건을 정의한 QueryBuilder를 만들고 이를 상속하여 데이터베이스에 맞는 QueryBuilder(MysqlQueryBuilder, MongodbQueryBuilder 등)를 만든다.

```typescript
/** query-builder.interface.ts */
import { IPropertyQuery, PropertyQuery } from './property-query';

export abstract class QueryBuilder {
    protected _employeeNo: IPropertyQuery<number, 'equals' | 'in'>;
    get employeeNo() {
        return this._employeeNo;
    }
    constructor() {
        this._employeeNo = new PropertyQuery();
    }
}

/** repository.interface.ts */
import { QueryBuilder } from './query-builder.interface';
import { Employee as EmployeeEntity } from './employee.entity';

export abstract class Repository {
    abstract getQueryBuilder(): QueryBuilder;
    abstract findOne(queryBuilder: QueryBuilder): Promise<EmployeeEntity>;
}

/** employee.service.ts */
import { Injectable } from '@nestjs/common';
import { Repository as EmployeeRepository } from './repository.interface.ts';

@Injectable()
export class EmployeeService {
    constructor(private employeeRepository: EmployeeRepository) {}

    async findOne(employeeNo: number): Promise<EmployeeEntity> {
        const queryBuilder = this.employeeRepository.getQueryBuilder();
        const employeeEntity =
            await this.employeeRepository.findOne(queryBuilder);
        return employeeEntity;
    }
}
```

<div id="repository-structure"></div>

#### Structure

도메인별로 레포지토리를 만들기 위해서 아래와 같은 구조를 사용한다. mysql, mongodb 등 데이터베이스의 종류에 따라 폴더를 만든다. \_\_mock\_\_ 폴더는 테스트를 위해서 사용할 mock 객체를 정의한다.

```
repository
├── [domain-name]
│   ├── __mock__
│   │   ├── repository.ts
│   │   └── index.ts
│   ├── mysql
│   │   ├── model.ts
│   │   ├── query-builder.ts
│   │   ├── repository.ts
│   │   └── index.ts
│   ├── repository.interface.ts
│   ├── query-builder.interface.ts
│   └── module.ts
└── repository.module.ts
```

<div id="repository-usage"></div>

#### Usage

사용하는 데이터베이스와 ORM에 맞게 모델과 QueryBuilder를 만들고 repository.interface를 구현한다. 위에서 query-builder.ts, repository.interface는 만들었기 때문에 생략한다.

Repository에서는 모델을 반환하지 않고 도메인 엔티티를 반환한다. 모델은 ORM이나 데이터베이스의 종류에 따라 달라질 수 있기 때문이다. 모델이 동일한 구조를 가지도록 만드는 것은 권장하지 않는다. 가령 Mysql과 같은 관계형 데이터베이스는 여러 개의 모델 간 관계를 설정하기 위해서 테이블을 분리한다. 하지만 Mongodb와 같은 Document 기반의 데이터베이스는 Collection을 분리하지 않고 Nested 하게 구성할 수 있다. 이렇듯 데이터베이스의 특징에 따라 모델링이 달라질 수 있기 때문에 비즈니스 로직에 노출되지 않도록 하는 것이 좋다.

Typeorm과 Mysql을 사용하는 예제는 아래와 같이 구현할 수 있다.

example:

```typescript
/** mysql/model.ts */
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'employees' })
export class Employee {
    @PrimaryColumn({ name: 'emp_no' })
    employeeNo: number;

    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;
}

/** mysql/query-builder.ts */
import { Equal } from 'typeorm';
import { QueryCondition } from '../../property-query';
import { QueryBuilder } from '../query-builder.interface';
import { Employee as EmployeeModel } from './model';

export class MysqlQueryBuilder extends QueryBuilder {
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

/** mysql/repository.ts */
import { Injectable } from '@nestjs/common';
import { Repository } from './repository';
import { MysqlQueryBuilder } from './query-builder.ts';
import { Employee as EmployeeModel } from './model';
import { Employee as EmployeeEntity } from 'domain/employee/employee.entity';

@Injectable()
export class MysqlRepository extends Repository {
    getQueryBuilder(): QueryBuilder {
        return new MysqlQueryBuilder();
    }
    async findOne(queryBuilder: MysqlQueryBuilder): Promise<EmployeeEntity> {
        const queryCondition = querybuilder.build();
        const model = await EmployeeModel.findOneBy(queryCondition);
        return model === null && new EmployeeEntity({ ...model });
    }
}

/** module.ts */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository as EmployeeRepository } from './repository.interface';
import { Employee as EmployeeModel } from './mysql/model';
import { MysqlRepository as EmployeeMysqlRepository } from './mysql/repository';

@Module({
    imports: [TypeOrmModule.forFeature([EmployeeModel])],
    providers: [
        {
            provide: EmployeeRepository,
            useClass: EmployeeMysqlRepository,
        },
    ],
    exports: [EmployeeMysqlRepository],
})
export class RepositoryModule {}
```

Mongoose과 Mongodb를 사용하는 예제는 아래와 같이 구현할 수 있다.

example:

```typescript
/** mongodb/model.ts */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmployeeDocument = HydratedDocument<Employee>;

@Schema()
export class Employee {
    @Prop({ required: true })
    employeeNo: number;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

/** mongodb/query-builder.ts */
import { QueryCondition } from '../../property-query';
import { QueryBuilder } from '../query-builder.interface';
import { Employee } from './model';

export class MongodbQueryBuilder extends QueryBuilder {
    constructor() {
        super();
    }
    build(): QueryCondition<Employee, 'employeeNo'> {
        const query: ReturnType<typeof this.build> = {};
        if (this._employeeNo.type === 'equals') {
            query.employeeNo = { $eq: this._employeeNo.value };
            // query.employeeNo = this._employeeNo.value;
        }
        return query;
    }
}

/** mongodb/repository.ts */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from './repository';
import { MongodbQueryBuilder } from './query-builder.ts';
import { Employee } from './model';
import { Employee as EmployeeEntity } from 'domain/employee/employee.entity';

@Injectable()
export class MongodbRepository extends Repository {
    constructor(
        @InjectModel(Employee.name)
        private employeeModel: Model<Employee>,
    ) {
        super();
    }
    getQueryBuilder(): QueryBuilder {
        return new MongodbQueryBuilder();
    }
    async findOne(queryBuilder: MongodbQueryBuilder): Promise<EmployeeEntity> {
        const query = this.accessLogModel.find();
        if (queryBuilder) {
            query.where(queryBuilder.build());
        }
        const model = await query;
        return model === null && new EmployeeEntity({ ...model });
    }
}

/** module.ts */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Repository as EmployeeRepository } from './repository.interface';
import { Employee, EmployeeSchema } from './mongodb/model';
import { MongodbRepository as EmployeeMongodbRepository } from './mongodb/repository';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Employee.name, schema: EmployeeSchema },
        ]),
    ],
    providers: [
        {
            provide: EmployeeRepository,
            useClass: EmployeeMongodbRepository,
        },
    ],
    exports: [EmployeeRepository],
})
export class RepositoryModule {}
```

비즈니스 로직에서는 아래와 같이 데이터베이스의 종류와 사용중인 ORM과 상관없이 같이 동일한 방식으로 사용할 수 있다.

example:

```typescript
const queryBuilder = this.employeeRepository.getQueryBuilder();
queryBuilder.employeeNo.equals(100023);

const employeeEntity = await this.employeeRepository.findOne(queryBuilder);
```

<div id="multiple-database"></div>

#### Mutiple Database

여러 개의 데이터베이스를 같이 사용하려면 루트 모듈에 연결 정보를 추가한다. 어떤 레포지토리가 어떤 데이터베이스를 사용할지는 각 레포지토리 모듈에서 설정한다.

example:

```typescript
// repository/module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        TypeOrmModule.forRoot({ ... }),
        MongooseModule.forRoot({ ... }),
    ],
})
export class RepositoryModule {}

// repository/employee/module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeRepository } from './repository.interface';
import { Employee } from './mysql/model';
import { EmployeeMysqlRepository } from './mysql/repository';

@Module({
    imports: [TypeOrmModule.forFeature([Employee])],
    providers: [
        {
            provide: EmployeeRepository,
            useClass: EmployeeMysqlRepository
        }
    ],
    exports: [EmployeeRepository],
})
export class EmployeeRepositoryModule {}

// repository/department/module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DepartmentRepository } from './repository.interface';
import { Department, DepartmentSchema } from './mongodb/model';
import { DepartmentMongodbRepository } from './mongodb/repository';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Department.name, schema: DepartmentSchema },
        ])
    ],
    providers: [
        {
            provide: DepartmentRepository,
            useClass: DepartmentMongodbRepository
        }
    ],
    exports: [DepartmentRepository],
})
export class DepartmentRepositoryModule {}
```
