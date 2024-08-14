import { Injectable } from '@nestjs/common';
import { SearchEmployeeSalaryDto } from './dto/request.dto';
import { EmployeeSalaryRepository } from '@infrastructure/repository/employee-salary/repository.interface';
import { PaginatedList } from '@core/base-response.dto';
import { EmployeeSalaryDto } from './dto/response.dto';
import { PaginationDto } from '@core/base-request.dto';
import { Order } from '@infrastructure/repository/shared-types';

@Injectable()
export class EmployeeSalaryApplicationService {
    constructor(private employeeSalaryRepository: EmployeeSalaryRepository) {}

    async getPaginatedSalaryList(
        searchEmployeeSalaryDto: SearchEmployeeSalaryDto,
    ): Promise<PaginatedList<EmployeeSalaryDto>> {
        const { employeeNo, fromDate, toDate, page, limit } =
            searchEmployeeSalaryDto;
        const queryBuilder = this.employeeSalaryRepository.getQueryBuilder();
        if (employeeNo) {
            queryBuilder.employeeNo.equals(employeeNo);
        }
        if (fromDate) {
            queryBuilder.fromDate.between(fromDate, toDate);
        }

        const [employeeSalaries, count] = await Promise.all([
            this.employeeSalaryRepository.findMany({
                queryBuilder,
                paginationOption: { page, limit },
                orderOption: { employeeNo: Order.Ascending },
            }),
            this.employeeSalaryRepository.count(queryBuilder),
        ]);
        const paginatedList = new PaginatedList<EmployeeSalaryDto>({
            currentPage: page,
            totalPage: Math.ceil(count / limit),
            currentCount: employeeSalaries.length,
            totalCount: count,
            list: employeeSalaries.map(
                (employeeSalary) => new EmployeeSalaryDto(employeeSalary),
            ),
        });
        return paginatedList;
    }

    async getPaginatedSalaryListByEmployee(
        employeeNo: number,
        paginationDto: PaginationDto,
    ): Promise<PaginatedList<EmployeeSalaryDto>> {
        const { page, limit } = paginationDto;
        const queryBuilder = this.employeeSalaryRepository.getQueryBuilder();
        queryBuilder.employeeNo.equals(employeeNo);
        const [employeeSalaries, count] = await Promise.all([
            this.employeeSalaryRepository.findMany({
                queryBuilder,
                paginationOption: { page, limit },
                orderOption: { fromDate: Order.Descending },
            }),
            this.employeeSalaryRepository.count(queryBuilder),
        ]);
        const paginatedList = new PaginatedList<EmployeeSalaryDto>({
            currentPage: page,
            totalPage: Math.ceil(count / limit),
            currentCount: employeeSalaries.length,
            totalCount: count,
            list: employeeSalaries.map(
                (employeeSalary) => new EmployeeSalaryDto(employeeSalary),
            ),
        });
        return paginatedList;
    }
}
