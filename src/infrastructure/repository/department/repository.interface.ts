import { Department } from '@domain/department/entity';
import { QueryBuilder } from './query-builder.interface';
import {
    PaginationOption,
    OrderOption,
} from '@infrastructure/repository/shared-types';

export abstract class DepartmentRepository {
    abstract getQueryBuilder(): QueryBuilder;
    abstract findOne(queryBuilder: QueryBuilder): Promise<Department>;
    abstract findMany(args: {
        queryBuilder?: QueryBuilder;
        paginationOption?: PaginationOption;
        orderOption?: OrderOption<
            Pick<Department, 'departmentNo' | 'departmentName'>
        >;
    }): Promise<Department[]>;
    abstract count(queryBuilder?: QueryBuilder): Promise<number>;
    abstract save(entity: Department): Promise<void>;
    abstract update(entity: Department): Promise<void>;
}
