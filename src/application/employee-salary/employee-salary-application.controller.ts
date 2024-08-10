import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    ApiBadRequestException,
    ApiPaginatedResponse,
    ApiUnauthorizedException,
} from '@core/controller.decorator';
import { PaginationDto } from '@core/base-request.dto';
import { SearchEmployeeSalaryDto } from './dto/request.dto';
import { EmployeeSalaryApplicationService } from './employee-salary-application.service';
import { EmployeeSalaryDto } from './dto/response.dto';

@ApiTags('Employee Salary')
@Controller({ version: '1', path: 'salaries' })
export class EmployeeSalaryApplicationController {
    constructor(
        private employeeSalaryApplicationService: EmployeeSalaryApplicationService,
    ) {}

    @Get()
    @ApiOperation({
        summary: '연봉 내역 목록 조회',
        description: '연봉 내역 목록 조회',
    })
    @ApiBearerAuth()
    @ApiBadRequestException()
    @ApiUnauthorizedException()
    async getPaginatedSalaryList(
        @Query() searchEmployeeSalaryDto: SearchEmployeeSalaryDto,
    ) {
        return this.employeeSalaryApplicationService.getPaginatedSalaryList(
            searchEmployeeSalaryDto,
        );
    }

    @Get('/:employeeNo')
    @ApiOperation({
        summary: '사원 연봉 내역 조회',
        description: '사원 연봉 내역 조회',
    })
    @ApiBearerAuth()
    @ApiPaginatedResponse({ status: HttpStatus.OK, type: EmployeeSalaryDto })
    @ApiBadRequestException()
    @ApiUnauthorizedException()
    async getSalaryList(
        @Param('employeeNo') employeeNo: number,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.employeeSalaryApplicationService.getPaginatedSalaryListByEmployee(
            employeeNo,
            paginationDto,
        );
    }
}
