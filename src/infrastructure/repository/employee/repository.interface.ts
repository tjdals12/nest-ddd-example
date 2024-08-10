import { Employee } from '@domain/employee/entity';
import { QueryBuilder } from './query-builder.interface';
import {
    OrderOption,
    PaginationOption,
} from '@infrastructure/repository/shared-types';

export enum Gender {
    M = 'M',
    F = 'F',
}

export abstract class EmployeeRepository {
    abstract getQueryBuilder(): QueryBuilder;
    abstract findOne(queryBuilder: QueryBuilder): Promise<Employee>;
    abstract findMany(args: {
        queryBuilder?: QueryBuilder;
        paginationOption?: PaginationOption;
        orderOption?: OrderOption<Pick<Employee, 'employeeNo'>>;
    }): Promise<Employee[]>;
    abstract count(queryBuilder?: QueryBuilder): Promise<number>;
    abstract save(entity: Employee): Promise<Employee>;
    abstract update(entity: Employee): Promise<void>;
}
