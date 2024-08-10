import {
    Controller,
    Post,
    Patch,
    Get,
    Body,
    HttpStatus,
    Param,
    Query,
    HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@core/base-request.dto';
import {
    ChangeManagerDto,
    CreateDepartmentDto,
    UpdateDepartmentDto,
} from './dto/request.dto';
import { DepartmentDto, DepartmentManagerDto } from './dto/response.dto';
import { DepartmentApplicationService } from './department-application.service';
import {
    ApiPaginatedResponse,
    ApiBadRequestException,
    ApiUnauthorizedException,
    ApiNotFoundException,
    ApiBaseResponse,
} from '@core/controller.decorator';
import { PaginatedList } from '@core/base-response.dto';

@ApiTags('Department')
@Controller({
    version: '1',
    path: 'departments',
})
export class DepartmentApplicationController {
    constructor(
        private departmentApplicationService: DepartmentApplicationService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '부서 추가', description: '부서 추가' })
    @ApiBearerAuth()
    @ApiBaseResponse({
        status: HttpStatus.OK,
        type: DepartmentDto,
    })
    @ApiBadRequestException()
    @ApiUnauthorizedException()
    async create(@Body() createDepartmentDto: CreateDepartmentDto) {
        return this.departmentApplicationService.create(createDepartmentDto);
    }

    @Patch('/:departmentNo')
    @ApiOperation({ summary: '부서 수정', description: '부서 수정' })
    @ApiBearerAuth()
    @ApiBaseResponse({ status: HttpStatus.OK, type: DepartmentDto })
    @ApiBadRequestException()
    @ApiUnauthorizedException()
    @ApiNotFoundException()
    async update(
        @Param('departmentNo') departmentNo: string,
        @Body() updateDepartmentDto: UpdateDepartmentDto,
    ) {
        return this.departmentApplicationService.update(
            departmentNo,
            updateDepartmentDto,
        );
    }

    @Get('/:departmentNo')
    @ApiOperation({
        summary: '부서 조회',
        description: '부서 조회',
    })
    @ApiBearerAuth()
    @ApiBaseResponse({ status: HttpStatus.OK, type: DepartmentDto })
    @ApiNotFoundException()
    @ApiUnauthorizedException()
    async get(@Param('departmentNo') departmentNo: string) {
        return this.departmentApplicationService.getDepartment(departmentNo);
    }

    @Get()
    @ApiOperation({
        summary: '부서 목록 조회 (Paginated)',
        description: '부서 목록 변경 (Paginated)',
    })
    @ApiBearerAuth()
    @ApiPaginatedResponse({ status: HttpStatus.OK, type: DepartmentDto })
    @ApiBadRequestException()
    @ApiUnauthorizedException()
    async getPaginatedList(
        @Query() paginationDto: PaginationDto,
    ): Promise<PaginatedList<DepartmentDto>> {
        return this.departmentApplicationService.getPaginatedDepartmentList(
            paginationDto,
        );
    }

    @Get('/:departmentNo/managers')
    @ApiOperation({
        summary: '부서 매니저 목록 조회 (Paginated)',
        description: '부서 매니저 목록 조회 (Paginated)',
    })
    @ApiBearerAuth()
    @ApiPaginatedResponse({ status: HttpStatus.OK, type: DepartmentManagerDto })
    @ApiBadRequestException()
    @ApiUnauthorizedException()
    async getPaginatedManagerList(
        @Param('departmentNo') departmentNo: string,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.departmentApplicationService.getPaginatedDepartmentManagerList(
            departmentNo,
            paginationDto,
        );
    }

    @Patch('/:departmentNo/managers')
    @ApiOperation({
        summary: '부서 매니저 변경',
        description: '부서 매니저 변경',
    })
    @ApiBearerAuth()
    @ApiBaseResponse({
        status: HttpStatus.OK,
        type: DepartmentManagerDto,
        isArray: true,
    })
    @ApiBadRequestException()
    @ApiUnauthorizedException()
    async changeManager(
        @Param('departmentNo') departmentNo: string,
        @Body() changeManagerDto: ChangeManagerDto,
    ) {
        return this.departmentApplicationService.changeManager(
            departmentNo,
            changeManagerDto,
        );
    }

    @Get('/:departmentNo/employees')
    @ApiOperation({
        summary: '부서 사원 목록 조회 (Paginated)',
        description: '부서 사원 목록 조회 (Paginated)',
    })
    @ApiBearerAuth()
    @ApiPaginatedResponse({ status: HttpStatus.OK, type: DepartmentManagerDto })
    @ApiBadRequestException()
    @ApiUnauthorizedException()
    async getPaginatedEmployeeList(
        @Param('departmentNo') departmentNo: string,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.departmentApplicationService.getPaginatedDepartmentEmployeeList(
            departmentNo,
            paginationDto,
        );
    }
}
