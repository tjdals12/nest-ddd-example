import { UserRepository } from '../repository.interface';
import { QueryBuilder } from '../query-builder.interface';

export const userRepository: UserRepository = {
    getQueryBuilder: jest.fn().mockReturnValue(new QueryBuilder()),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
};
