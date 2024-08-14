## Description <!-- omit in toc -->

A example of DDD(Domain Driven Development) implementation using nestjs framework

## Table of Contents <!-- omit in toc -->

-   [Infrastructure](#infrastructure)
    -   [Repository](#infrastructure-repository)
        -   [Query Builder](#repository-query-builder)
        -   [Structure](#repository-structure)
        -   [Usage](#repository-usage)
        -   [Mutiple Database](#mutiple-database)

## Infrastructure

환경 변수 관리, 영속성 관리, 캐시, third-party API 등 인프라와 관련된 모듈이 위치하는 레이어이다.

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
./repository
├── domain
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
└── └── module.ts
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
