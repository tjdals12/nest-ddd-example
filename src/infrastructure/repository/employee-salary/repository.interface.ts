import { EmployeeSalary } from '@domain/employee-salary/entity';
import { QueryBuilder } from './query-builder.interface';
import {
    OrderOption,
    PaginationOption,
} from '@infrastructure/repository/shared-types';

export abstract class EmployeeSalaryRepository {
    abstract getQueryBuilder(): QueryBuilder;
    abstract findMany(args: {
        queryBuilder?: QueryBuilder;
        paginationOption?: PaginationOption;
        orderOption?: OrderOption<
            Pick<EmployeeSalary, 'employeeNo' | 'fromDate'>
        >;
    }): Promise<EmployeeSalary[]>;
    abstract count(queryBuilder?: QueryBuilder): Promise<number>;
}
