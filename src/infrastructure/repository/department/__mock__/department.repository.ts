import { DepartmentRepository } from '../repository.interface';
import { QueryBuilder } from '../query-builder.interface';

export const departmentRepository: DepartmentRepository = {
    getQueryBuilder: jest.fn().mockReturnValue(new QueryBuilder()),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
};
