import { QueryCondition } from '@infrastructure/repository/property-query';
import { QueryBuilder } from '../query-builder.interface';
import { Employee } from './employee.model';
import { Equal } from 'typeorm';

export class MysqlEmployeeQueryBuilder extends QueryBuilder {
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
