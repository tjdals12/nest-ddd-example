import { Test } from '@nestjs/testing';
import { EmployeeApplicationService } from './employee-application.service';
import {
    EmployeeDomainFactory,
    EmployeeTitleDomainFactory,
    DepartmentEmployeeDomainFactory,
} from '@domain/employee/factory';
import { EmployeeRepository } from '@infrastructure/repository/employee/repository.interface';
import { mockEmployeeRepository } from '@infrastructure/repository/employee/__mock__';
import { DepartmentRepository } from '@infrastructure/repository/department/repository.interface';
import { mockDepartmentRepository } from '@infrastructure/repository/department/__mock__';
import {
    ChangeDepartmentDto,
    ChangeTitleDto,
    CreateEmployeeDto,
    UpdateEmployeeDto,
} from './dto/request.dto';
import { EmployeeDto } from './dto/response.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Employee } from '@domain/employee/entity';
import { PaginationDto } from '@core/base-request.dto';
import { PaginatedList } from '@core/base-response.dto';
import { Department } from '@domain/department/entity';

describe('EmployeeApplicationService', () => {
    let employeeApplicationService: EmployeeApplicationService;
    let employeeDomainFactory: EmployeeDomainFactory;
    let employeeTitleDomainFactory: EmployeeTitleDomainFactory;
    let departmentEmployeeDomainFactory: DepartmentEmployeeDomainFactory;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                EmployeeApplicationService,
                EmployeeDomainFactory,
                DepartmentEmployeeDomainFactory,
                EmployeeTitleDomainFactory,
                {
                    provide: EmployeeRepository,
                    useValue: mockEmployeeRepository,
                },
                {
                    provide: DepartmentRepository,
                    useValue: mockDepartmentRepository,
                },
            ],
        }).compile();
        employeeApplicationService = moduleRef.get<EmployeeApplicationService>(
            EmployeeApplicationService,
        );
        employeeDomainFactory = moduleRef.get<EmployeeDomainFactory>(
            EmployeeDomainFactory,
        );
        employeeTitleDomainFactory = moduleRef.get<EmployeeTitleDomainFactory>(
            EmployeeTitleDomainFactory,
        );
        departmentEmployeeDomainFactory =
            moduleRef.get<DepartmentEmployeeDomainFactory>(
                DepartmentEmployeeDomainFactory,
            );
    });

    describe('create', () => {
        const correctDto = new CreateEmployeeDto();
        correctDto.firstName = 'Gildong';
        correctDto.lastName = 'Hong';
        correctDto.gender = 'M';
        correctDto.birthDate = new Date('1992-07-24');
        correctDto.hireDate = new Date('2023-09-12');

        let create: jest.SpyInstance;
        let save: jest.SpyInstance;

        beforeAll(() => {
            create = jest.spyOn(employeeDomainFactory, 'create');
            save = jest.spyOn(mockEmployeeRepository, 'save');
        });

        beforeEach(() => {
            create.mockClear();
            save.mockClear();
        });

        it('엔티티를 생성하고 영속화 해야 한다.', async () => {
            await employeeApplicationService.create(correctDto);
            expect(create).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
        });

        it('DTO를 반환해야 한다.', async () => {
            const result = await employeeApplicationService.create(correctDto);
            expect(result).toBeInstanceOf(EmployeeDto);
        });

        const wrongDto = new CreateEmployeeDto();

        it('파라미터가 잘못될 경우 에러를 발생시켜야 한다.', async () => {
            await expect(
                employeeApplicationService.create(wrongDto),
            ).rejects.toThrow(BadRequestException);
        });
    });
    describe('update', () => {
        const employeeNo = 10000;
        const correctDto = new UpdateEmployeeDto();
        correctDto.firstName = 'Minsoo';

        const entity = new Employee({
            type: 'restore',
            employeeNo,
            firstName: 'Gildong',
            lastName: 'Hong',
            gender: 'M',
            birthDate: new Date('1992-07-24'),
            hireDate: new Date('2023-09-12'),
            departments: [],
            titles: [],
            latestSalary: null,
        });

        let updateEntity: jest.SpyInstance;
        let update: jest.SpyInstance;
        let findOne: jest.SpyInstance;

        beforeAll(() => {
            updateEntity = jest.spyOn(entity, 'update');
            update = jest.spyOn(mockEmployeeRepository, 'update');
            findOne = jest.spyOn(mockEmployeeRepository, 'findOne');
        });

        beforeEach(() => {
            updateEntity.mockClear();
            update.mockClear();
            findOne.mockClear();
        });

        it('엔티티를 업데이트하고 영속화 해야 한다.', async () => {
            findOne.mockResolvedValue(entity);
            await employeeApplicationService.update(employeeNo, correctDto);
            expect(updateEntity).toHaveBeenCalled();
            expect(update).toHaveBeenCalled();
        });
        it('DTO를 반환해야 한다.', async () => {
            findOne.mockResolvedValue(entity);
            const result = await employeeApplicationService.update(
                employeeNo,
                correctDto,
            );
            expect(result).toBeInstanceOf(EmployeeDto);
        });
        it('엔티티를 존재하지 않는다면 에러를 발생시켜야 한다.', async () => {
            findOne.mockResolvedValue(null);
            await expect(
                employeeApplicationService.update(employeeNo, correctDto),
            ).rejects.toThrow(NotFoundException);
            expect(findOne).toHaveBeenCalled();
        });

        const wrongDto = new UpdateEmployeeDto();
        wrongDto.firstName = '#123';

        it('파라미터가 잘못된 경우 에러를 발생시켜야 한다.', async () => {
            findOne.mockResolvedValue(entity);
            await expect(
                employeeApplicationService.update(employeeNo, wrongDto),
            ).rejects.toThrow(BadRequestException);
            expect(findOne).toHaveBeenCalled();
        });
    });
    describe('getEmployee', () => {
        const employeeNo = 10000;

        const entity = new Employee({
            type: 'restore',
            employeeNo,
            firstName: 'Gildong',
            lastName: 'Hong',
            gender: 'M',
            birthDate: new Date('1992-07-24'),
            hireDate: new Date('2023-09-12'),
            departments: [],
            titles: [],
            latestSalary: null,
        });

        let findOne: jest.SpyInstance;

        beforeAll(() => {
            findOne = jest.spyOn(mockEmployeeRepository, 'findOne');
        });

        beforeEach(() => {
            findOne.mockClear();
        });

        it('DTO를 반환해야 한다', async () => {
            findOne.mockResolvedValue(entity);
            const result =
                await employeeApplicationService.getEmployee(employeeNo);
            expect(result).toBeInstanceOf(EmployeeDto);
            expect(findOne).toHaveBeenCalled();
        });
        it('엔티티를 존재하지 않는다면 에러를 발생시켜야 한다.', async () => {
            findOne.mockResolvedValue(null);
            await expect(
                employeeApplicationService.getEmployee(employeeNo),
            ).rejects.toThrow(NotFoundException);
            expect(findOne).toHaveBeenCalled();
        });
    });
    describe('getPaginatedEmplooyeeList', () => {
        const entities = Array.from(
            new Array(10),
            (_, index) =>
                new Employee({
                    type: 'restore',
                    employeeNo: 10000 + index,
                    firstName: 'Gildong',
                    lastName: 'Hong',
                    gender: 'M',
                    birthDate: new Date('1992-07-24'),
                    hireDate: new Date('2023-09-12'),
                    departments: [],
                    titles: [],
                    latestSalary: null,
                }),
        );

        const dto = new PaginationDto();
        dto.page = 1;
        dto.limit = entities.length;

        let findMany: jest.SpyInstance;
        let count: jest.SpyInstance;

        beforeAll(() => {
            findMany = jest.spyOn(mockEmployeeRepository, 'findMany');
            count = jest.spyOn(mockEmployeeRepository, 'count');
        });

        it('PaginatedList를 반환해야 한다', async () => {
            findMany.mockResolvedValue(entities);
            count.mockResolvedValue(entities.length);

            const result =
                await employeeApplicationService.getPaginatedEmployeeList(dto);
            expect(result).toBeInstanceOf(PaginatedList);
            expect(
                result.list.every((v) => v instanceof EmployeeDto),
            ).toBeTruthy();
        });
    });
    describe('changeDepartment', () => {
        const employeeNo = 10000;
        const correctDto = new ChangeDepartmentDto();
        correctDto.departmentNo = 'd010';
        correctDto.fromDate = new Date('2024-05-13');

        let createDepartmentEmployee: jest.SpyInstance;
        let update: jest.SpyInstance;
        let findOneEmployee: jest.SpyInstance;
        let findOneDepartment: jest.SpyInstance;

        beforeAll(() => {
            createDepartmentEmployee = jest.spyOn(
                departmentEmployeeDomainFactory,
                'create',
            );
            update = jest.spyOn(mockEmployeeRepository, 'update');
            findOneEmployee = jest.spyOn(mockEmployeeRepository, 'findOne');
            findOneDepartment = jest.spyOn(mockDepartmentRepository, 'findOne');
        });

        beforeEach(() => {
            createDepartmentEmployee.mockClear();
            update.mockClear();
            findOneEmployee.mockClear();
            findOneDepartment.mockClear();
        });

        it('엔티티를 업데이트하고 영속화 해야 한다.', async () => {
            const employee = new Employee({
                type: 'restore',
                employeeNo,
                firstName: 'Gildong',
                lastName: 'Hong',
                gender: 'M',
                birthDate: new Date('1992-07-24'),
                hireDate: new Date('2023-09-12'),
                departments: [],
                titles: [],
                latestSalary: null,
            });
            findOneEmployee.mockResolvedValue(employee);
            const department = new Department({
                departmentNo: 'd014',
                departmentName: 'Backend Development',
            });
            findOneDepartment.mockResolvedValue(department);
            const changeDepartment = jest.spyOn(employee, 'changeDepartment');
            await employeeApplicationService.changeDepartment(
                employeeNo,
                correctDto,
            );
            expect(findOneEmployee).toHaveBeenCalled();
            expect(findOneDepartment).toHaveBeenCalled();
            expect(createDepartmentEmployee).toHaveBeenCalled();
            expect(changeDepartment).toHaveBeenCalled();
            expect(update).toHaveBeenCalled();
        });

        it('DTO를 반환해야 한다.', async () => {
            const employee = new Employee({
                type: 'restore',
                employeeNo,
                firstName: 'Gildong',
                lastName: 'Hong',
                gender: 'M',
                birthDate: new Date('1992-07-24'),
                hireDate: new Date('2023-09-12'),
                departments: [],
                titles: [],
                latestSalary: null,
            });
            findOneEmployee.mockResolvedValue(employee);
            const department = new Department({
                departmentNo: 'd014',
                departmentName: 'Backend Development',
            });
            findOneDepartment.mockResolvedValue(department);
            const result = await employeeApplicationService.changeDepartment(
                employeeNo,
                correctDto,
            );
            expect(result).toBeInstanceOf(EmployeeDto);
        });

        it('Employee 엔티티가 존재하지 않는다면 에러를 발생시켜야 한다.', async () => {
            findOneEmployee.mockResolvedValue(null);
            const department = new Department({
                departmentNo: 'd014',
                departmentName: 'Backend Development',
            });
            findOneDepartment.mockResolvedValue(department);
            await expect(
                employeeApplicationService.changeDepartment(
                    employeeNo,
                    correctDto,
                ),
            ).rejects.toThrow(NotFoundException);
        });

        it('Department 엔티티가 존재하지 않는다면 에러를 발생시켜야 한다.', async () => {
            const employee = new Employee({
                type: 'restore',
                employeeNo,
                firstName: 'Gildong',
                lastName: 'Hong',
                gender: 'M',
                birthDate: new Date('1992-07-24'),
                hireDate: new Date('2023-09-12'),
                departments: [],
                titles: [],
                latestSalary: null,
            });
            findOneEmployee.mockResolvedValue(employee);
            findOneDepartment.mockResolvedValue(null);
            await expect(
                employeeApplicationService.changeDepartment(
                    employeeNo,
                    correctDto,
                ),
            ).rejects.toThrow(BadRequestException);
        });

        const wrongDto = new ChangeDepartmentDto();
        wrongDto.departmentNo = 'd012';
        wrongDto.fromDate = null;

        it('파라미터가 잘못된 경우 에러를 발생시켜야 한다.', async () => {
            const employee = new Employee({
                type: 'restore',
                employeeNo,
                firstName: 'Gildong',
                lastName: 'Hong',
                gender: 'M',
                birthDate: new Date('1992-07-24'),
                hireDate: new Date('2023-09-12'),
                departments: [],
                titles: [],
                latestSalary: null,
            });
            findOneEmployee.mockResolvedValue(employee);
            const department = new Department({
                departmentNo: 'd014',
                departmentName: 'Backend Development',
            });
            findOneDepartment.mockResolvedValue(department);
            await expect(
                employeeApplicationService.changeDepartment(
                    employeeNo,
                    wrongDto,
                ),
            ).rejects.toThrow(BadRequestException);
        });
    });
    describe('changeTitle', () => {
        const employeeNo = 10000;
        const correctDto = new ChangeTitleDto();
        correctDto.title = 'Backend Engineer';
        correctDto.fromDate = new Date('2024-05-13');

        let createEmployeeTitle: jest.SpyInstance;
        let update: jest.SpyInstance;
        let findOne: jest.SpyInstance;

        beforeAll(() => {
            createEmployeeTitle = jest.spyOn(
                employeeTitleDomainFactory,
                'create',
            );
            update = jest.spyOn(mockEmployeeRepository, 'update');
            findOne = jest.spyOn(mockEmployeeRepository, 'findOne');
        });

        beforeEach(() => {
            createEmployeeTitle.mockClear();
            update.mockClear();
            findOne.mockClear();
        });

        it('엔티티를 업데이트하고 영속화 해야 한다.', async () => {
            const employee = new Employee({
                type: 'restore',
                employeeNo,
                firstName: 'Gildong',
                lastName: 'Hong',
                gender: 'M',
                birthDate: new Date('1992-07-24'),
                hireDate: new Date('2023-09-12'),
                departments: [],
                titles: [],
                latestSalary: null,
            });
            findOne.mockResolvedValue(employee);
            const changeTitle = jest.spyOn(employee, 'changeTitle');
            await employeeApplicationService.changeTitle(
                employeeNo,
                correctDto,
            );
            expect(findOne).toHaveBeenCalled();
            expect(createEmployeeTitle).toHaveBeenCalled();
            expect(changeTitle).toHaveBeenCalled();
            expect(update).toHaveBeenCalled();
        });
        it('DTO를 반환해야 한다.', async () => {
            const employee = new Employee({
                type: 'restore',
                employeeNo,
                firstName: 'Gildong',
                lastName: 'Hong',
                gender: 'M',
                birthDate: new Date('1992-07-24'),
                hireDate: new Date('2023-09-12'),
                departments: [],
                titles: [],
                latestSalary: null,
            });
            findOne.mockResolvedValue(employee);
            const result = await employeeApplicationService.changeTitle(
                employeeNo,
                correctDto,
            );
            expect(result).toBeInstanceOf(EmployeeDto);
        });
        it('엔티티가 존재하지 않는다면 에러를 발생시켜야 한다.', async () => {
            findOne.mockResolvedValue(null);
            await expect(
                employeeApplicationService.changeTitle(employeeNo, correctDto),
            ).rejects.toThrow(NotFoundException);
        });

        const wrongDto = new ChangeTitleDto();
        wrongDto.title = correctDto.title;
        wrongDto.fromDate = null;

        it('파라미터가 잘못된 경우 에러를 발생시켜야 한다.', async () => {
            const employee = new Employee({
                type: 'restore',
                employeeNo,
                firstName: 'Gildong',
                lastName: 'Hong',
                gender: 'M',
                birthDate: new Date('1992-07-24'),
                hireDate: new Date('2023-09-12'),
                departments: [],
                titles: [],
                latestSalary: null,
            });
            findOne.mockResolvedValue(employee);
            await expect(
                employeeApplicationService.changeTitle(employeeNo, wrongDto),
            ).rejects.toThrow(BadRequestException);
        });
    });
});
