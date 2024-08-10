import {
    Employee as EmployeeEntity,
    DepartmentEmployee as DepartmentEmployeeEntity,
    EmployeeTitle as EmployeeTitleEntity,
    EmployeeSalary as EmployeeSalaryEntity,
} from '@domain/employee/entity';
import { EmployeeRepository } from '../repository.interface';
import { Employee as EmployeeModel } from './employee.model';
import { DepartmentEmployee as DepartmentEmployeeModel } from '@infrastructure/repository/department-employee/mysql';
import { EmployeeTitle as EmployeeTitleModel } from '@infrastructure/repository/employee-title/mysql';
import { MysqlEmployeeQueryBuilder } from './employee.query-builder';
import {
    PaginationOption,
    OrderOption,
} from '@infrastructure/repository/shared-types';
import { DataSource, FindManyOptions } from 'typeorm';
import { QueryBuilder } from '../query-builder.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MysqlEmployeeRepository extends EmployeeRepository {
    constructor(private dataSource: DataSource) {
        super();
    }

    getQueryBuilder(): QueryBuilder {
        return new MysqlEmployeeQueryBuilder();
    }
    async findOne(
        queryBuilder: MysqlEmployeeQueryBuilder,
    ): Promise<EmployeeEntity> {
        const queryCondition = queryBuilder.build();
        const model = await EmployeeModel.findOne({
            where: queryCondition,
            relations: {
                departmentEmployees: {
                    department: true,
                },
                employeeTitles: true,
                employeeSalaries: true,
            },
        });
        if (model === null) return null;
        return this.toEntity(model);
    }
    async findMany(args: {
        queryBuilder?: MysqlEmployeeQueryBuilder;
        paginationOption?: PaginationOption;
        orderOption?: OrderOption<Pick<EmployeeEntity, 'employeeNo'>>;
    }): Promise<EmployeeEntity[]> {
        const { queryBuilder, paginationOption, orderOption } = args;
        const query: FindManyOptions<EmployeeModel> = {};
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
            departmentEmployees: { department: true },
            employeeTitles: true,
            employeeSalaries: true,
        };
        const models = await EmployeeModel.find(query);
        return models.map((model) => this.toEntity(model));
    }
    async count(queryBuilder?: MysqlEmployeeQueryBuilder): Promise<number> {
        const queryCondition = queryBuilder ? queryBuilder.build() : {};
        const count = await EmployeeModel.countBy(queryCondition);
        return count;
    }
    async save(entity: EmployeeEntity): Promise<EmployeeEntity> {
        const model = await EmployeeModel.create({
            firstName: entity.firstName,
            lastName: entity.lastName,
            gender: entity.gender,
            birthDate: entity.birthDate,
            hireDate: entity.hireDate,
        }).save();
        return this.toEntity(model);
    }
    async update(entity: EmployeeEntity): Promise<void> {
        this.dataSource.transaction(async (manager) => {
            await Promise.all(
                entity.departments.map((department) => {
                    return manager.upsert(
                        DepartmentEmployeeModel,
                        {
                            employeeNo: entity.employeeNo,
                            departmentNo: department.departmentNo,
                            fromDate: department.fromDate,
                            toDate: department.toDate,
                        },
                        {
                            conflictPaths: ['employeeNo', 'departmentNo'],
                        },
                    );
                }),
            );
            await Promise.all(
                entity.titles.map((employeeTitle) => {
                    return manager.upsert(
                        EmployeeTitleModel,
                        {
                            employeeNo: entity.employeeNo,
                            title: employeeTitle.title,
                            fromDate: employeeTitle.fromDate,
                            toDate: employeeTitle.toDate,
                        },
                        { conflictPaths: ['employeeNo', 'title', 'fromDate'] },
                    );
                }),
            );
            await manager.update(
                EmployeeModel,
                {
                    employeeNo: entity.employeeNo,
                },
                {
                    firstName: entity.firstName,
                    lastName: entity.lastName,
                    gender: entity.gender,
                    birthDate: entity.birthDate,
                    hireDate: entity.hireDate,
                },
            );
        });
    }
    private toEntity(model: EmployeeModel) {
        const departmentEmployeeEntities = [];
        if (model.departmentEmployees) {
            model.departmentEmployees.forEach((v) => {
                const departmentEmployeeEntity = new DepartmentEmployeeEntity({
                    type: 'restore',
                    departmentNo: v.departmentNo,
                    departmentName: v.department.departmentName,
                    fromDate: v.fromDate,
                    toDate: v.toDate,
                });
                departmentEmployeeEntities.push(departmentEmployeeEntity);
            });
        }
        const employeeTitleEntities = [];
        if (model.employeeTitles) {
            model.employeeTitles.forEach((v) => {
                const employeeTitleEntity = new EmployeeTitleEntity({
                    type: 'restore',
                    title: v.title,
                    fromDate: v.fromDate,
                    toDate: v.toDate,
                });
                employeeTitleEntities.push(employeeTitleEntity);
            });
        }
        let employeeSalary = null;
        if (model.employeeSalaries.length > 0) {
            const employeeSalaryModel = model.employeeSalaries.sort(
                (a, b) => b.fromDate.getTime() - a.fromDate.getTime(),
            )[0];
            employeeSalary = new EmployeeSalaryEntity({
                salary: employeeSalaryModel.salary,
                fromDate: employeeSalaryModel.fromDate,
                toDate: employeeSalaryModel.toDate,
            });
        }
        const employeeEntity = new EmployeeEntity({
            type: 'restore',
            employeeNo: model.employeeNo,
            firstName: model.firstName,
            lastName: model.lastName,
            gender: model.gender,
            birthDate: model.birthDate,
            hireDate: model.hireDate,
            departments: departmentEmployeeEntities,
            titles: employeeTitleEntities,
            latestSalary: employeeSalary,
        });
        return employeeEntity;
    }
}
