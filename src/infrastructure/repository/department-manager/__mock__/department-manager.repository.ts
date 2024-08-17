import { mock } from 'jest-mock-extended';
import { QueryBuilder } from '../query-builder.interface';
import { DepartmentManagerRepository } from '../repository.interface';

const mockDepartmentManagerRepository = mock<DepartmentManagerRepository>();
mockDepartmentManagerRepository.getQueryBuilder.mockReturnValue(
    new QueryBuilder(),
);

export { mockDepartmentManagerRepository };
