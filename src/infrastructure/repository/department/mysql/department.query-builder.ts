import { Equal } from 'typeorm';
import { QueryCondition } from '@infrastructure/repository/property-query';
import { QueryBuilder } from '../query-builder.interface';
import { Department } from './department.model';

export class MysqlDepartmentQueryBuilder extends QueryBuilder {
    constructor() {
        super();
    }
    build(): QueryCondition<Department, 'departmentNo' | 'departmentName'> {
        const query: ReturnType<typeof this.build> = {};
        if (this._departmentNo.type === 'equals') {
            query.departmentNo = Equal(this._departmentNo.value);
        }
        if (this._departmentName.type === 'equals') {
            query.departmentName = Equal(this._departmentName.value);
        }
        return query;
    }
}
