import { DataSource, FindManyOptions } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DepartmentRepository } from '../repository.interface';
import { Department as DepartmentEntity } from '@domain/department/entity';
import { Department as DepartmentModel } from './department.model';
import { QueryBuilder } from '../query-builder.interface';
import { MysqlDepartmentQueryBuilder } from './department.query-builder';
import {
    PaginationOption,
    OrderOption,
} from '@infrastructure/repository/shared-types';

@Injectable()
export class MysqlDepartmentRepository extends DepartmentRepository {
    constructor(private dataSource: DataSource) {
        super();
    }

    getQueryBuilder(): QueryBuilder {
        return new MysqlDepartmentQueryBuilder();
    }

    async findOne(
        queryBuilder: MysqlDepartmentQueryBuilder,
    ): Promise<DepartmentEntity> {
        const queryCondition = queryBuilder.build();
        const model = await DepartmentModel.findOneBy(queryCondition);
        if (model === null) return null;
        return this.toEntity(model);
    }

    async findMany(args: {
        queryBuilder?: MysqlDepartmentQueryBuilder;
        paginationOption?: PaginationOption;
        orderOption?: OrderOption<DepartmentEntity>;
    }): Promise<DepartmentEntity[]> {
        const { queryBuilder, paginationOption, orderOption } = args;
        const query: FindManyOptions<DepartmentModel> = {};
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
        const models = await DepartmentModel.find(query);
        return models.map((model) => this.toEntity(model));
    }

    async count(queryBuilder?: MysqlDepartmentQueryBuilder): Promise<number> {
        const queryCondition = queryBuilder ? queryBuilder.build() : {};
        const count = await DepartmentModel.countBy(queryCondition);
        return count;
    }

    async save(entity: DepartmentEntity) {
        await DepartmentModel.insert({
            departmentNo: entity.departmentNo,
            departmentName: entity.departmentName,
        });
    }

    async update(entity: DepartmentEntity): Promise<void> {
        await DepartmentModel.update(
            {
                departmentNo: entity.departmentNo,
            },
            {
                departmentName: entity.departmentName,
            },
        );
    }

    private toEntity(model: DepartmentModel) {
        const departmentEntity = new DepartmentEntity({
            departmentNo: model.departmentNo,
            departmentName: model.departmentName,
        });
        return departmentEntity;
    }
}
