import { Equal } from 'typeorm';
import { QueryCondition } from '@infrastructure/repository/property-query';
import { QueryBuilder } from '../query-builder.interface';
import { DepartmentManager } from './department-manager.model';

export class MysqlDepartmentManagerQueryBuilder extends QueryBuilder {
    constructor() {
        super();
    }
    build(): QueryCondition<DepartmentManager, 'departmentNo'> {
        const query: ReturnType<typeof this.build> = {};
        if (this._departmentNo.type === 'equals') {
            query.departmentNo = Equal(this._departmentNo.value);
        }
        return query;
    }
}
