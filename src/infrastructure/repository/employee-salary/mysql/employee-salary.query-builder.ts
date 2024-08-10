import * as moment from 'moment';
import { QueryCondition } from '@infrastructure/repository/property-query';
import { QueryBuilder } from '../query-builder.interface';
import { EmployeeSalary } from './employee-salary.model';
import { Equal, Between } from 'typeorm';

export class MysqlEmployeeSalaryQueryBuilder extends QueryBuilder {
    constructor() {
        super();
    }
    build(): QueryCondition<EmployeeSalary, 'employeeNo' | 'fromDate'> {
        const query: ReturnType<typeof this.build> = {};
        if (this._employeeNo.type === 'equals') {
            query.employeeNo = Equal(this._employeeNo.value);
        }
        if (this._fromDate.type === 'between') {
            query.fromDate = Between(
                this.fromDate.values[0],
                this.fromDate.values[1],
            );
        }
        return query;
    }
    buildQuery(): string[] {
        const query = [];
        if (this._employeeNo.type === 'equals') {
            query.push(`emp_no = ${this.employeeNo.value}`);
        }
        if (this._fromDate.type === 'between') {
            query.push(
                `from_date BETWEEN '${moment(this.fromDate.values[0]).format('YYYY-MM-DD')}' AND '${moment(this.fromDate.values[1]).format('YYYY-MM-DD')}'`,
            );
        }
        return query;
    }
}
