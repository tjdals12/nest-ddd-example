import { DepartmentEmployee } from '@domain/department-employee/entity';
import { QueryBuilder } from './query-builder.interface';
import {
    OrderOption,
    PaginationOption,
} from '@infrastructure/repository/shared-types';

export abstract class DepartmentEmployeeRepository {
    abstract getQueryBuilder(): QueryBuilder;
    abstract findOne(queryBuilder: QueryBuilder): Promise<DepartmentEmployee>;
    abstract findMany(args: {
        queryBuilder?: QueryBuilder;
        paginationOption?: PaginationOption;
        orderOption?: OrderOption<Pick<DepartmentEmployee, 'employeeNo'>>;
    }): Promise<DepartmentEmployee[]>;
    abstract count(queryBuilder?: QueryBuilder): Promise<number>;
    abstract save(entity: DepartmentEmployee): Promise<void>;
    abstract update(entity: DepartmentEmployee): Promise<void>;
}
