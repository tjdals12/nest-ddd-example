import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import {
    ChangeDepartmentDto,
    ChangeTitleDto,
    CreateEmployeeDto,
    UpdateEmployeeDto,
} from './dto/request.dto';
import { PaginationDto } from '@core/base-request.dto';
import { EmployeeDto } from './dto/response.dto';
import { PaginatedList } from '@core/base-response.dto';
import {
    EmployeeDomainFactory,
    EmployeeTitleDomainFactory,
    DepartmentEmployeeDomainFactory,
} from '@domain/employee/factory';
import { EmployeeRepository } from '@infrastructure/repository/employee/repository.interface';
import { DepartmentRepository } from '@infrastructure/repository/department/repository.interface';
import { Order } from '@infrastructure/repository/shared-types';
import { Employee } from '@domain/employee/entity';

@Injectable()
export class EmployeeApplicationService {
    constructor(
        private employeeDomainFactory: EmployeeDomainFactory,
        private departmentEmployeeDomainFactory: DepartmentEmployeeDomainFactory,
        private employeeTitleDomainFactory: EmployeeTitleDomainFactory,
        private employeeRepository: EmployeeRepository,
        private departmentRepository: DepartmentRepository,
    ) {}

    async create(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeDto> {
        let employee: Employee = null;
        try {
            employee = this.employeeDomainFactory.create(createEmployeeDto);
        } catch {
            throw new BadRequestException();
        }
        try {
            employee = await this.employeeRepository.save(employee);
        } catch {
            throw new InternalServerErrorException();
        }
        const employeeDto = new EmployeeDto(employee);
        return employeeDto;
    }

    async update(
        employeeNo: number,
        updateEmployeeDto: UpdateEmployeeDto,
    ): Promise<EmployeeDto> {
        const queryBuilder = this.employeeRepository.getQueryBuilder();
        queryBuilder.employeeNo.equals(employeeNo);
        const employee = await this.employeeRepository.findOne(queryBuilder);
        if (employee === null) throw new NotFoundException();
        try {
            employee.update(updateEmployeeDto);
        } catch {
            throw new BadRequestException();
        }
        try {
            await this.employeeRepository.update(employee);
        } catch {
            throw new InternalServerErrorException();
        }
        const employeeDto = new EmployeeDto(employee);
        return employeeDto;
    }

    async getEmployee(employeeNo: number): Promise<EmployeeDto> {
        const employeeQueryBuilder = this.employeeRepository.getQueryBuilder();
        employeeQueryBuilder.employeeNo.equals(employeeNo);
        const employee =
            await this.employeeRepository.findOne(employeeQueryBuilder);
        if (employee === null) throw new NotFoundException();
        const employeeDto = new EmployeeDto(employee);
        return employeeDto;
    }

    async getPaginatedEmployeeList(
        paginationDto: PaginationDto,
    ): Promise<PaginatedList<EmployeeDto>> {
        const { page, limit } = paginationDto;
        const [employees, count] = await Promise.all([
            this.employeeRepository.findMany({
                paginationOption: { page, limit },
                orderOption: { employeeNo: Order.Ascending },
            }),
            this.employeeRepository.count(),
        ]);
        const paginatedList = new PaginatedList<EmployeeDto>({
            currentPage: page,
            totalPage: Math.ceil(count / limit),
            currentCount: employees.length,
            totalCount: count,
            list: employees.map((employee) => new EmployeeDto(employee)),
        });
        return paginatedList;
    }

    async changeDepartment(
        employeeNo: number,
        changeDepartmentDto: ChangeDepartmentDto,
    ): Promise<EmployeeDto> {
        const employeeQueryBuilder = this.employeeRepository.getQueryBuilder();
        employeeQueryBuilder.employeeNo.equals(employeeNo);
        const employee =
            await this.employeeRepository.findOne(employeeQueryBuilder);
        if (employee === null) throw new NotFoundException();

        const { departmentNo, fromDate } = changeDepartmentDto;
        const departmentQueryBuilder =
            this.departmentRepository.getQueryBuilder();
        departmentQueryBuilder.departmentNo.equals(departmentNo);
        const department = await this.departmentRepository.findOne(
            departmentQueryBuilder,
        );
        if (department === null) throw new BadRequestException();

        try {
            const departmentEmployee =
                await this.departmentEmployeeDomainFactory.create({
                    departmentNo: department.departmentNo,
                    departmentName: department.departmentName,
                    fromDate,
                });

            employee.changeDepartment(departmentEmployee);
        } catch {
            throw new BadRequestException();
        }

        try {
            await this.employeeRepository.update(employee);
        } catch {
            throw new InternalServerErrorException();
        }

        const employeeDto = new EmployeeDto(employee);
        return employeeDto;
    }

    async changeTitle(
        employeeNo: number,
        changeTitleDto: ChangeTitleDto,
    ): Promise<EmployeeDto> {
        const queryBuilder = this.employeeRepository.getQueryBuilder();
        queryBuilder.employeeNo.equals(employeeNo);
        const employee = await this.employeeRepository.findOne(queryBuilder);
        if (employee === null) throw new NotFoundException();

        try {
            const employeeTitle =
                this.employeeTitleDomainFactory.create(changeTitleDto);
            employee.changeTitle(employeeTitle);
        } catch {
            throw new BadRequestException();
        }

        try {
            await this.employeeRepository.update(employee);
        } catch {
            throw new InternalServerErrorException();
        }

        const employeeDto = new EmployeeDto(employee);
        return employeeDto;
    }
}
