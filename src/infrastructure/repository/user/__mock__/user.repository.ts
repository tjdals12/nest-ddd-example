import { mock } from 'jest-mock-extended';
import { UserRepository } from '../repository.interface';
import { QueryBuilder } from '../query-builder.interface';

const mockUserRepository = mock<UserRepository>();
mockUserRepository.getQueryBuilder.mockReturnValue(new QueryBuilder());

export { mockUserRepository };
