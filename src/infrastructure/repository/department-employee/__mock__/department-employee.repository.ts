import { mock } from 'jest-mock-extended';
import { DepartmentEmployeeRepository } from '../repository.interface';
import { QueryBuilder } from '../query-builder.interface';

const mockDepartmentEmployeeRepository = mock<DepartmentEmployeeRepository>();
mockDepartmentEmployeeRepository.getQueryBuilder.mockReturnValue(
    new QueryBuilder(),
);

export { mockDepartmentEmployeeRepository };
