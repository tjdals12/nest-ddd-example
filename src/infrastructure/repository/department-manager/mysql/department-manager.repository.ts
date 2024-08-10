import { DataSource, FindManyOptions } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DepartmentManagerRepository } from '../repository.interface';
import { DepartmentManager as DepartmentManagerEntity } from '@domain/department-manager/entity';
import { DepartmentManager as DepartmentManagerModel } from './department-manager.model';
import {
    PaginationOption,
    OrderOption,
} from '@infrastructure/repository/shared-types';
import { QueryBuilder } from '../query-builder.interface';
import { MysqlDepartmentManagerQueryBuilder } from './department-manager.query-builder';

@Injectable()
export class MysqlDepartmentManagerRepository extends DepartmentManagerRepository {
    constructor(private dataSource: DataSource) {
        super();
    }

    getQueryBuilder(): QueryBuilder {
        return new MysqlDepartmentManagerQueryBuilder();
    }
    async findOne(
        queryBuilder: MysqlDepartmentManagerQueryBuilder,
    ): Promise<DepartmentManagerEntity> {
        const queryCondition = queryBuilder.build();
        const model = await DepartmentManagerModel.findOneBy(queryCondition);
        if (model === null) return null;
        return this.toEntity(model);
    }
    async findMany(args: {
        queryBuilder?: MysqlDepartmentManagerQueryBuilder;
        paginationOption?: PaginationOption;
        orderOption?: OrderOption<Pick<DepartmentManagerEntity, 'employeeNo'>>;
    }): Promise<DepartmentManagerEntity[]> {
        const { queryBuilder, paginationOption, orderOption } = args;
        const query: FindManyOptions<DepartmentManagerModel> = {};
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
        const models = await DepartmentManagerModel.find(query);
        return models.map((model) => this.toEntity(model));
    }
    async count(
        queryBuilder?: MysqlDepartmentManagerQueryBuilder,
    ): Promise<number> {
        const queryCondition = queryBuilder ? queryBuilder.build() : {};
        const count = await DepartmentManagerModel.countBy(queryCondition);
        return count;
    }
    async save(entity: DepartmentManagerEntity): Promise<void> {
        await DepartmentManagerModel.insert({
            departmentNo: entity.departmentNo,
            employeeNo: entity.employeeNo,
            fromDate: entity.fromDate,
            toDate: entity.toDate,
        });
    }
    async update(entity: DepartmentManagerEntity): Promise<void> {
        await DepartmentManagerModel.upsert(
            {
                departmentNo: entity.departmentNo,
                employeeNo: entity.employeeNo,
                fromDate: entity.fromDate,
                toDate: entity.toDate,
            },
            { conflictPaths: ['departmentNo', 'employeeNo'] },
        );
    }
    async updateAll(entities: DepartmentManagerEntity[]): Promise<void> {
        await this.dataSource.transaction(async (manager) => {
            await Promise.all(
                entities.map((entity) => {
                    return manager.upsert(
                        DepartmentManagerModel,
                        {
                            departmentNo: entity.departmentNo,
                            employeeNo: entity.employeeNo,
                            fromDate: entity.fromDate,
                            toDate: entity.toDate,
                        },
                        {
                            conflictPaths: ['departmentNo', 'employeeNo'],
                        },
                    );
                }),
            );
        });
    }
    private toEntity(model: DepartmentManagerModel) {
        const departmentManagerEntity = new DepartmentManagerEntity({
            type: 'restore',
            departmentNo: model.departmentNo,
            employeeNo: model.employeeNo,
            firstName: model.employee.firstName,
            lastName: model.employee.lastName,
            fromDate: model.fromDate,
            toDate: model.toDate,
        });
        return departmentManagerEntity;
    }
}
