import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { AccessLogDto } from '@application/access-log/dto/access-log.dto';
import { AccessLog } from './acess-log.model';
import {
    PaginationOption,
    OrderOption,
    Order,
} from '@infrastructure/repository/shared-types';
import { QueryBuilder } from '../query-builder.interface';
import { AccessLogRepository } from '../repository.interface';
import { MongodbAccessLogQueryBuilder } from './access-log.query-builder';

@Injectable()
export class MongodbAccessLogRepository extends AccessLogRepository {
    constructor(
        @InjectModel(AccessLog.name) private accessLogModel: Model<AccessLog>,
    ) {
        super();
    }

    getQueryBuilder(): QueryBuilder {
        return new MongodbAccessLogQueryBuilder();
    }

    async findMany(args: {
        queryBuilder?: MongodbAccessLogQueryBuilder;
        paginationOption?: PaginationOption;
        orderOption?: OrderOption<Pick<AccessLogDto, 'date'>>;
    }): Promise<AccessLogDto[]> {
        const { queryBuilder, paginationOption, orderOption } = args;
        const query = this.accessLogModel.find();
        if (queryBuilder) {
            query.where(queryBuilder.build());
        }
        if (paginationOption) {
            const { page, limit } = paginationOption;
            query.skip((page - 1) * limit).limit(limit);
        }
        if (orderOption) {
            query.sort(
                Object.entries(orderOption).map<[string, SortOrder]>(
                    ([key, value]) => [
                        key,
                        value === Order.Ascending ? 'asc' : 'desc',
                    ],
                ),
            );
        }
        const models = await query;
        return models.map(
            (model) =>
                new AccessLogDto({
                    path: model.path,
                    userId: model.userId,
                    date: model.date,
                }),
        );
    }

    async count(queryBuilder?: MongodbAccessLogQueryBuilder): Promise<number> {
        const query = this.accessLogModel.countDocuments();
        if (queryBuilder) {
            query.where(queryBuilder.build());
        }
        const count = await query;
        return count;
    }

    async save(dto: AccessLogDto): Promise<void> {
        const model = new this.accessLogModel(dto);
        await model.save();
    }
}
