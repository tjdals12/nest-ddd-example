import { mock } from 'jest-mock-extended';
import { EmployeeRepository } from '../repository.interface';
import { QueryBuilder } from '../query-builder.interface';

const mockEmployeeRepository = mock<EmployeeRepository>();
mockEmployeeRepository.getQueryBuilder.mockReturnValue(new QueryBuilder());
mockEmployeeRepository.save.mockImplementation(async (entity) => entity);
export { mockEmployeeRepository };
