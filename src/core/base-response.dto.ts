import { ApiHideProperty } from '@nestjs/swagger';

export class PaginatedList<T> {
    currentPage: number;
    totalPage: number;
    currentCount: number;
    totalCount: number;
    @ApiHideProperty()
    list: T[];
    constructor(
        args: Pick<
            PaginatedList<T>,
            'currentPage' | 'totalPage' | 'currentCount' | 'totalCount' | 'list'
        >,
    ) {
        const { currentPage, totalPage, currentCount, totalCount, list } = args;
        this.currentPage = currentPage;
        this.totalPage = totalPage;
        this.currentCount = currentCount;
        this.totalCount = totalCount;
        this.list = list;
    }
}

export class BaseResponse<T> {
    statusCode: number;
    message: string;
    @ApiHideProperty()
    data: T;
    constructor(
        args: Pick<BaseResponse<T>, 'statusCode' | 'message' | 'data'>,
    ) {
        const { statusCode, message, data } = args;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}
