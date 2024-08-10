import { Equal } from 'typeorm';
import { QueryBuilder } from '../query-builder.interface';
import { QueryCondition } from '@infrastructure/repository/property-query';
import { DepartmentEmployee } from './department-employee.model';

export class MysqlDepartmentEmployeeQueryBuilder extends QueryBuilder {
    constructor() {
        super();
    }
    build(): QueryCondition<DepartmentEmployee, 'departmentNo'> {
        const query: ReturnType<typeof this.build> = {};
        if (this._departmentNo.type === 'equals') {
            query.departmentNo = Equal(this._departmentNo.value);
        }
        return query;
    }
}
