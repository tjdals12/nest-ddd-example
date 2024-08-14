import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
    EmployeeSalary as EmployeeSalaryEntity,
    Employee as EmployeeEntity,
} from '@domain/employee-salary/entity';
import {
    PaginationOption,
    OrderOption,
    Order,
} from '@infrastructure/repository/shared-types';
import { QueryBuilder } from '../query-builder.interface';
import { EmployeeSalaryRepository } from '../repository.interface';
import { EmployeeSalary as EmployeeSalaryModel } from './employee-salary.model';
import { MysqlEmployeeSalaryQueryBuilder } from './employee-salary.query-builder';

import { Employee as EmployeeModel } from '@infrastructure/repository/employee/mysql';

export class MysqlEmployeeSalaryRepository extends EmployeeSalaryRepository {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private dataSource: DataSource,
    ) {
        super();
    }

    getQueryBuilder(): QueryBuilder {
        return new MysqlEmployeeSalaryQueryBuilder();
    }
    async findMany(args: {
        queryBuilder?: MysqlEmployeeSalaryQueryBuilder;
        paginationOption?: PaginationOption;
        orderOption?: OrderOption<
            Pick<EmployeeSalaryEntity, 'employeeNo' | 'fromDate'>
        >;
    }): Promise<EmployeeSalaryEntity[]> {
        const { queryBuilder, paginationOption, orderOption } = args;
        const raws = await this.dataSource
            .createQueryBuilder()
            .from((subquery) => {
                subquery.from(EmployeeSalaryModel, 's');
                if (queryBuilder) {
                    const conditions = queryBuilder.buildQuery();
                    conditions.forEach((condition) => {
                        subquery.andWhere(`s.${condition}`);
                    });
                }
                if (paginationOption) {
                    const { page, limit } = paginationOption;
                    subquery.offset((page - 1) * limit);
                    subquery.limit(limit);
                }
                if (orderOption) {
                    Object.entries(orderOption).forEach(([key, value]) => {
                        subquery.addOrderBy(
                            `s.${key}`,
                            value === Order.Ascending ? 'ASC' : 'DESC',
                        );
                    });
                }
                return subquery;
            }, 's')
            .addFrom(EmployeeModel, 'e')
            .where('s.emp_no = e.emp_no')
            .getRawMany();
        return raws.map((raw) => {
            const employeeEntity = new EmployeeEntity({
                firstName: raw.first_name,
                lastName: raw.last_name,
            });
            return new EmployeeSalaryEntity({
                type: 'restore',
                employeeNo: raw.emp_no,
                salary: raw.salary,
                fromDate: raw.from_date,
                toDate: raw.to_date,
                employee: employeeEntity,
            });
        });
    }
    async count(
        queryBuilder?: MysqlEmployeeSalaryQueryBuilder,
    ): Promise<number> {
        const queryCondition = queryBuilder ? queryBuilder.build() : {};
        const cacheKey = `employee-salary:count:${JSON.stringify(queryCondition)}`;
        let count = await this.cacheManager.get<number>(cacheKey);
        if (count === null) {
            count = await EmployeeSalaryModel.countBy(queryCondition);
            await this.cacheManager.set(cacheKey, count, { ttl: 0 } as any);
        }
        return count;
    }
    toEntity(model: EmployeeSalaryModel): EmployeeSalaryEntity {
        const employeeEntity = new EmployeeEntity({
            firstName: model.employee.firstName,
            lastName: model.employee.lastName,
        });
        const employeeSalaryEntity = new EmployeeSalaryEntity({
            type: 'restore',
            employeeNo: model.employeeNo,
            salary: model.salary,
            fromDate: model.fromDate,
            toDate: model.toDate,
            employee: employeeEntity,
        });
        return employeeSalaryEntity;
    }
}
