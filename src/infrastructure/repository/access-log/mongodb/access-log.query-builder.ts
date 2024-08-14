import { QueryCondition } from '@infrastructure/repository/property-query';
import { QueryBuilder } from '../query-builder.interface';
import { AccessLog } from './acess-log.model';

export class MongodbAccessLogQueryBuilder extends QueryBuilder {
    constructor() {
        super();
    }

    build(): QueryCondition<AccessLog, 'date'> {
        const query: ReturnType<typeof this.build> = {};
        if (this._date.type === 'between') {
            query.date = {
                $gte: this._date.values[0],
                $lte: this._date.values[1],
            };
        } else if (this._date.type === 'greaterThanOrEquals') {
            query.date = {
                $gte: this._date.value,
            };
        } else if (this._date.type == 'lessThanOrEquals') {
            query.date = {
                $lte: this._date.value,
            };
        }
        return query;
    }
}
