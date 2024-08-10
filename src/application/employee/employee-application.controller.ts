import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmployeeApplicationService } from './employee-application.service';
import {
    ChangeDepartmentDto,
    ChangeTitleDto,
    CreateEmployeeDto,
    UpdateEmployeeDto,
} from './dto/request.dto';
import {
    ApiBadRequestException,
    ApiBaseResponse,
    ApiNotFoundException,
    ApiPaginatedResponse,
    ApiUnauthorizedException,
} from '@core/controller.decorator';
import { EmployeeDto } from './dto/response.dto';
import { PaginationDto } from '@core/base-request.dto';

@ApiTags('Employee')
@Controller({
    version: '1',
    path: 'employees',
})
export class EmployeeApplicationController {
    constructor(
        private employeeApplicationService: EmployeeApplicationService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '사원 추가', description: '사원 추가' })
    @ApiBearerAuth()
    @ApiBaseResponse({
        status: HttpStatus.OK,
        type: EmployeeDto,
    })
    @ApiBadRequestException()
    @ApiUnauthorizedException()
    async create(@Body() createEmployeeDto: CreateEmployeeDto) {
        return this.employeeApplicationService.create(createEmployeeDto);
    }

    @Patch('/:employeeNo')
    @ApiOperation({ summary: '사원 수정', description: '사원 수정' })
    @ApiBearerAuth()
    @ApiBaseResponse({
        status: HttpStatus.OK,
        type: EmployeeDto,
    })
    @ApiBadRequestException()
    @ApiUnauthorizedException()
    @ApiNotFoundException()
    async update(
        @Param('employeeNo') employeeNo: number,
        @Body() updateEmployeeDto: UpdateEmployeeDto,
    ) {
        return this.employeeApplicationService.update(
            employeeNo,
            updateEmployeeDto,
        );
    }

    @Get('/:employeeNo')
    @ApiOperation({ summary: '사원 조회', description: '사원 조회' })
    @ApiBearerAuth()
    @ApiBaseResponse({ status: HttpStatus.OK, type: EmployeeDto })
    @ApiUnauthorizedException()
    @ApiNotFoundException()
    async get(@Param('employeeNo') employeeNo: number) {
        return this.employeeApplicationService.get(employeeNo);
    }

    @Get()
    @ApiOperation({
        summary: '사원 목록 조회',
        description: '사원 목록 조회',
    })
    @ApiBearerAuth()
    @ApiPaginatedResponse({ status: HttpStatus.OK, type: EmployeeDto })
    @ApiBadRequestException()
    @ApiUnauthorizedException()
    async getPaginatedEmployeeList(@Query() paginationDto: PaginationDto) {
        return this.employeeApplicationService.getPaginatedEmployeeList(
            paginationDto,
        );
    }

    @Patch('/:employeeNo/department')
    @ApiOperation({ summary: '부서 변경', description: '부서 변경' })
    @ApiBearerAuth()
    @ApiBaseResponse({
        status: HttpStatus.OK,
        type: EmployeeDto,
    })
    @ApiBadRequestException()
    @ApiUnauthorizedException()
    @ApiNotFoundException()
    async changeDepartment(
        @Param('employeeNo') employeeNo: number,
        @Body() changeDepartmentDto: ChangeDepartmentDto,
    ) {
        return this.employeeApplicationService.changeDepartment(
            employeeNo,
            changeDepartmentDto,
        );
    }

    @Patch('/:employeeNo/title')
    @ApiOperation({ summary: '직급 변경', description: '직급 변경' })
    @ApiBearerAuth()
    @ApiBaseResponse({
        status: HttpStatus.OK,
        type: EmployeeDto,
    })
    @ApiBadRequestException()
    @ApiUnauthorizedException()
    @ApiNotFoundException()
    async changeTitle(
        @Param('employeeNo') employeeNo: number,
        @Body() changeTitleDto: ChangeTitleDto,
    ) {
        return this.employeeApplicationService.changeTitle(
            employeeNo,
            changeTitleDto,
        );
    }
}
