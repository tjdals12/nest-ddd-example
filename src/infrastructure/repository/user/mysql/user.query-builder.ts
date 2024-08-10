import { QueryCondition } from '@infrastructure/repository/property-query';
import { QueryBuilder } from '../query-builder.interface';
import { User } from './user.model';
import { Equal } from 'typeorm';

export class MysqlUserQueryBuilder extends QueryBuilder {
    constructor() {
        super();
    }
    build(): QueryCondition<User, 'userId'> {
        const query: ReturnType<typeof this.build> = {};
        if (this._userId.type === 'equals') {
            query.userId = Equal(this._userId.value);
        }
        return query;
    }
}
