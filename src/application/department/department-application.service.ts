import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { DepartmentDomainFactory } from '@domain/department/factory';
import { DepartmentDomainService } from '@domain/department/service';
import { DepartmentRepository } from '@infrastructure/repository/department/repository.interface';
import { DepartmentManagerDomainFactory } from '@domain/department-manager/factory';
import { DepartmentManagerDomainService } from '@domain/department-manager/service';
import { DepartmentManagerRepository } from '@infrastructure/repository/department-manager/repository.interface';
import { DepartmentEmployeeRepository } from '@infrastructure/repository/department-employee/repository.interface';
import { PaginationDto } from '@core/base-request.dto';
import {
    ChangeManagerDto,
    CreateDepartmentDto,
    UpdateDepartmentDto,
} from './dto/request.dto';
import { PaginatedList } from '@core/base-response.dto';
import {
    DepartmentDto,
    DepartmentEmployeeDto,
    DepartmentManagerDto,
} from './dto/response.dto';
import { Order } from '@infrastructure/repository/shared-types';
import { EmployeeRepository } from '@infrastructure/repository/employee/repository.interface';

@Injectable()
export class DepartmentApplicationService {
    constructor(
        private departmentDomainFactory: DepartmentDomainFactory,
        private departmentDomainService: DepartmentDomainService,
        private departmentRepository: DepartmentRepository,
        private departmentManagerDomainFactory: DepartmentManagerDomainFactory,
        private departmentManagerDomainService: DepartmentManagerDomainService,
        private departmentManagerRepository: DepartmentManagerRepository,
        private departmentEmployeeRepository: DepartmentEmployeeRepository,
        private employeeRepository: EmployeeRepository,
    ) {}

    async create(
        createDepartmentDto: CreateDepartmentDto,
    ): Promise<DepartmentDto> {
        let department = null;
        try {
            department =
                this.departmentDomainFactory.create(createDepartmentDto);
            await this.departmentDomainService.checkDuplicate(department);
        } catch (e) {
            throw new BadRequestException();
        }
        try {
            await this.departmentRepository.save(department);
        } catch {
            throw new InternalServerErrorException();
        }
        const departmentDto = new DepartmentDto(department);
        return departmentDto;
    }

    async update(
        departmentNo: string,
        updateDepartmentDto: UpdateDepartmentDto,
    ): Promise<DepartmentDto> {
        const queryBuilder = this.departmentRepository.getQueryBuilder();
        queryBuilder.departmentNo.equals(departmentNo);
        const department =
            await this.departmentRepository.findOne(queryBuilder);
        if (department === null) throw new NotFoundException();
        try {
            department.update(updateDepartmentDto);
        } catch (e) {
            throw new BadRequestException();
        }
        try {
            await this.departmentRepository.update(department);
        } catch {
            throw new InternalServerErrorException();
        }
        const departmentDto = new DepartmentDto(department);
        return departmentDto;
    }

    async getDepartment(departmentNo: string): Promise<DepartmentDto> {
        const queryBuilder = this.departmentRepository.getQueryBuilder();
        queryBuilder.departmentNo.equals(departmentNo);
        const department =
            await this.departmentRepository.findOne(queryBuilder);
        if (department === null) throw new NotFoundException();
        const departmentDto = new DepartmentDto(department);
        return departmentDto;
    }

    async getPaginatedDepartmentList(
        paginationDto: PaginationDto,
    ): Promise<PaginatedList<DepartmentDto>> {
        const { page, limit } = paginationDto;
        const [departments, count] = await Promise.all([
            this.departmentRepository.findMany({
                paginationOption: { page, limit },
                orderOption: { departmentNo: Order.Ascending },
            }),
            this.departmentRepository.count(),
        ]);
        const paginatedList = new PaginatedList<DepartmentDto>({
            currentPage: page,
            totalPage: Math.ceil(count / limit),
            currentCount: departments.length,
            totalCount: count,
            list: departments.map(
                (department) => new DepartmentDto(department),
            ),
        });
        return paginatedList;
    }

    async getPaginatedDepartmentManagerList(
        departmentNo: string,
        paginationDto: PaginationDto,
    ): Promise<PaginatedList<DepartmentManagerDto>> {
        const { page, limit } = paginationDto;
        const queryBuilder = this.departmentManagerRepository.getQueryBuilder();
        queryBuilder.departmentNo.equals(departmentNo);
        const [departmentManagers, count] = await Promise.all([
            this.departmentManagerRepository.findMany({
                queryBuilder,
                paginationOption: { page, limit },
                orderOption: { employeeNo: Order.Ascending },
            }),
            this.departmentManagerRepository.count(queryBuilder),
        ]);
        const paginatedList = new PaginatedList<DepartmentManagerDto>({
            currentPage: page,
            totalPage: Math.ceil(count / limit),
            currentCount: departmentManagers.length,
            totalCount: count,
            list: departmentManagers.map(
                (departmentManager) =>
                    new DepartmentManagerDto(departmentManager),
            ),
        });
        return paginatedList;
    }

    async changeManager(
        departmentNo: string,
        changeManagerDto: ChangeManagerDto,
    ): Promise<DepartmentManagerDto[]> {
        const departmentQueryBuilder =
            this.departmentRepository.getQueryBuilder();
        departmentQueryBuilder.departmentNo.equals(departmentNo);
        const department = await this.departmentRepository.findOne(
            departmentQueryBuilder,
        );
        if (department === null) throw new NotFoundException();

        const { employeeNo, fromDate } = changeManagerDto;
        const employeeQueryBuilder = this.employeeRepository.getQueryBuilder();
        employeeQueryBuilder.employeeNo.equals(employeeNo);
        const employee =
            await this.employeeRepository.findOne(employeeQueryBuilder);
        if (employee === null) throw new BadRequestException();

        let updatedDepartmentManagers;
        try {
            const newDepartmentManager =
                this.departmentManagerDomainFactory.create({
                    departmentNo,
                    employeeNo: employee.employeeNo,
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    fromDate,
                });
            updatedDepartmentManagers =
                await this.departmentManagerDomainService.changeManager(
                    newDepartmentManager,
                );
        } catch {
            throw new BadRequestException();
        }

        try {
            await this.departmentManagerRepository.updateAll(
                updatedDepartmentManagers,
            );
        } catch {
            throw new InternalServerErrorException();
        }
        const departmentManagerDtos = updatedDepartmentManagers.map(
            (departmentManager) => new DepartmentManagerDto(departmentManager),
        );
        return departmentManagerDtos;
    }

    async getPaginatedDepartmentEmployeeList(
        departmentNo: string,
        paginationDto: PaginationDto,
    ): Promise<PaginatedList<DepartmentEmployeeDto>> {
        const { page, limit } = paginationDto;
        const queryBuilder =
            this.departmentEmployeeRepository.getQueryBuilder();
        queryBuilder.departmentNo.equals(departmentNo);
        const [departmentEmployees, count] = await Promise.all([
            this.departmentEmployeeRepository.findMany({
                queryBuilder,
                paginationOption: { page, limit },
                orderOption: { employeeNo: Order.Ascending },
            }),
            this.departmentEmployeeRepository.count(queryBuilder),
        ]);
        const paginatedList = new PaginatedList<DepartmentEmployeeDto>({
            currentPage: page,
            totalPage: Math.ceil(count / limit),
            currentCount: departmentEmployees.length,
            totalCount: count,
            list: departmentEmployees.map(
                (departmentEmployee) =>
                    new DepartmentEmployeeDto(departmentEmployee),
            ),
        });
        return paginatedList;
    }
}
