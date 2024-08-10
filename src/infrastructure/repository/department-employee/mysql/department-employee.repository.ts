import { FindManyOptions } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DepartmentEmployee as DepartmentEmployeeEntity } from '@domain/department-employee/entity';
import { DepartmentEmployee as DepartmentEmployeeModel } from './department-employee.model';
import { QueryBuilder } from '../query-builder.interface';
import {
    PaginationOption,
    OrderOption,
} from '@infrastructure/repository/shared-types';
import { MysqlDepartmentEmployeeQueryBuilder } from './department-employee.query-builder';
import { DepartmentEmployeeRepository } from '../repository.interface';

@Injectable()
export class MysqlDepartmentEmployeeRepository extends DepartmentEmployeeRepository {
    getQueryBuilder(): QueryBuilder {
        return new MysqlDepartmentEmployeeQueryBuilder();
    }
    async findOne(
        queryBuilder: MysqlDepartmentEmployeeQueryBuilder,
    ): Promise<DepartmentEmployeeEntity> {
        const queryCondition = queryBuilder.build();
        const model = await DepartmentEmployeeModel.findOneBy(queryCondition);
        if (model === null) return null;
        return this.toEntity(model);
    }
    async findMany(args: {
        queryBuilder?: MysqlDepartmentEmployeeQueryBuilder;
        paginationOption?: PaginationOption;
        orderOption?: OrderOption<Pick<DepartmentEmployeeEntity, 'employeeNo'>>;
    }): Promise<DepartmentEmployeeEntity[]> {
        const { queryBuilder, paginationOption, orderOption } = args;
        const query: FindManyOptions<DepartmentEmployeeModel> = {};
        if (queryBuilder) {
            query.where = queryBuilder.build();
        }
        if (paginationOption) {
            const { page, limit } = paginationOption;
            query.skip = (page - 1) * limit;
            query.take = limit;
        }
        if (orderOption) {
            query.order = orderOption;
        }
        query.relations = {
            employee: true,
        };
        const models = await DepartmentEmployeeModel.find(query);
        return models.map((model) => this.toEntity(model));
    }
    async count(
        queryBuilder?: MysqlDepartmentEmployeeQueryBuilder,
    ): Promise<number> {
        const queryCondition = queryBuilder ? queryBuilder.build() : {};
        const count = await DepartmentEmployeeModel.countBy(queryCondition);
        return count;
    }
    async save(entity: DepartmentEmployeeEntity): Promise<void> {
        await DepartmentEmployeeModel.insert({
            departmentNo: entity.departmentNo,
            employeeNo: entity.employeeNo,
            fromDate: entity.fromDate,
            toDate: entity.toDate,
        });
    }
    async update(entity: DepartmentEmployeeEntity): Promise<void> {
        await DepartmentEmployeeModel.upsert(
            {
                departmentNo: entity.departmentNo,
                employeeNo: entity.employeeNo,
                fromDate: entity.fromDate,
                toDate: entity.toDate,
            },
            { conflictPaths: ['departmentNo', 'employeeNo'] },
        );
    }
    private toEntity(model: DepartmentEmployeeModel): DepartmentEmployeeEntity {
        const entity = new DepartmentEmployeeEntity({
            type: 'restore',
            departmentNo: model.departmentNo,
            employeeNo: model.employeeNo,
            firstName: model.employee.firstName,
            lastName: model.employee.lastName,
            fromDate: model.fromDate,
            toDate: model.toDate,
        });
        return entity;
    }
}
