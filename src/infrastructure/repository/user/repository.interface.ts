import { User } from '@domain/user/entity';
import { QueryBuilder } from './query-builder.interface';

export abstract class UserRepository {
    abstract getQueryBuilder(): QueryBuilder;
    abstract findOne(queryBuilder: QueryBuilder): Promise<User>;
    abstract save(entity: User): Promise<void>;
    abstract update(entity: User): Promise<void>;
}
