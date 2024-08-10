import { DepartmentManager } from '@domain/department-manager/entity';
import { QueryBuilder } from './query-builder.interface';
import {
    PaginationOption,
    OrderOption,
} from '@infrastructure/repository/shared-types';

export abstract class DepartmentManagerRepository {
    abstract getQueryBuilder(): QueryBuilder;
    abstract findOne(queryBuilder: QueryBuilder): Promise<DepartmentManager>;
    abstract findMany(args: {
        queryBuilder?: QueryBuilder;
        paginationOption?: PaginationOption;
        orderOption?: OrderOption<Pick<DepartmentManager, 'employeeNo'>>;
    }): Promise<DepartmentManager[]>;
    abstract count(queryBuilder?: QueryBuilder): Promise<number>;
    abstract save(entity: DepartmentManager): Promise<void>;
    abstract update(entity: DepartmentManager): Promise<void>;
    abstract updateAll(entities: DepartmentManager[]): Promise<void>;
}
