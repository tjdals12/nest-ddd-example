import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    ApiBadRequestException,
    ApiPaginatedResponse,
    ApiUnauthorizedException,
} from '@core/controller.decorator';
import { PaginatedList } from '@core/base-response.dto';
import { SearchAccessLogDto } from './dto/request.dto';
import { AccessLogDto } from './dto/access-log.dto';
import { AccessLogApplicationService } from './access-log-application.service';

@ApiTags('Access Log')
@Controller({
    version: '1',
    path: 'access-logs',
})
export class AccessLogApplicationController {
    constructor(
        private accessLogApplicationService: AccessLogApplicationService,
    ) {}

    @Get()
    @ApiOperation({
        summary: '엑세스 로그 목록 조회',
        description: '엑세스 로그 목록 조회',
    })
    @ApiBearerAuth()
    @ApiPaginatedResponse({ status: HttpStatus.OK, type: AccessLogDto })
    @ApiBadRequestException()
    @ApiUnauthorizedException()
    async getPaginatedList(
        @Query() dto: SearchAccessLogDto,
    ): Promise<PaginatedList<AccessLogDto>> {
        return this.accessLogApplicationService.getPaginatedList(dto);
    }
}
