import { DepartmentRepository } from '../repository.interface';
import { QueryBuilder } from '../query-builder.interface';
import { mock } from 'jest-mock-extended';

const mockDepartmentRepository = mock<DepartmentRepository>();
mockDepartmentRepository.getQueryBuilder.mockReturnValue(new QueryBuilder());

export { mockDepartmentRepository };
