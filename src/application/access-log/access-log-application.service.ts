import { AccessLogRepository } from '@infrastructure/repository/access-log/repository.interface';
import { Injectable } from '@nestjs/common';
import { SearchAccessLogDto } from './dto/request.dto';
import { PaginatedList } from '@core/base-response.dto';
import { AccessLogDto } from './dto/access-log.dto';
import { Order } from '@infrastructure/repository/shared-types';

@Injectable()
export class AccessLogApplicationService {
    constructor(private accessLogRepository: AccessLogRepository) {}

    async getPaginatedList(
        dto: SearchAccessLogDto,
    ): Promise<PaginatedList<AccessLogDto>> {
        const { fromDate, toDate, page, limit } = dto;
        const queryBuilder = this.accessLogRepository.getQueryBuilder();
        if (fromDate && toDate) {
            queryBuilder.date.between(fromDate, toDate);
        } else if (fromDate) {
            queryBuilder.date.greaterThanOrEquals(fromDate);
        } else if (toDate) {
            queryBuilder.date.lessThanOrEquals(toDate);
        }

        const [accessLogs, count] = await Promise.all([
            this.accessLogRepository.findMany({
                queryBuilder,
                paginationOption: { page, limit },
                orderOption: { date: Order.Descending },
            }),
            this.accessLogRepository.count(queryBuilder),
        ]);
        const paginatedList = new PaginatedList<AccessLogDto>({
            currentPage: page,
            totalPage: Math.ceil(count / limit),
            currentCount: accessLogs.length,
            totalCount: count,
            list: accessLogs,
        });
        return paginatedList;
    }
}
