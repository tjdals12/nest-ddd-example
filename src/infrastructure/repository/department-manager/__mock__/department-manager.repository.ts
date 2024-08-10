import { QueryBuilder } from '../query-builder.interface';
import { DepartmentManagerRepository } from '../repository.interface';

export const departmentManagerRepository: DepartmentManagerRepository = {
    getQueryBuilder: jest.fn().mockReturnValue(new QueryBuilder()),
    findOne: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    updateAll: jest.fn(),
};
