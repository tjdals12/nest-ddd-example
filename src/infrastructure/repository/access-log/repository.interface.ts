import { AccessLogDto } from '@application/access-log/dto/access-log.dto';
import { OrderOption, PaginationOption } from '../shared-types';
import { QueryBuilder } from './query-builder.interface';

export abstract class AccessLogRepository {
    abstract getQueryBuilder(): QueryBuilder;
    abstract findMany(args: {
        queryBuilder?: QueryBuilder;
        paginationOption?: PaginationOption;
        orderOption?: OrderOption<Pick<AccessLogDto, 'date'>>;
    }): Promise<AccessLogDto[]>;
    abstract count(queryBuilder?: QueryBuilder): Promise<number>;
    abstract save(dto: AccessLogDto): Promise<void>;
}
