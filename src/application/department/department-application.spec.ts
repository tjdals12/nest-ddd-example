import { Test } from '@nestjs/testing';
import { DepartmentApplicationService } from './department-application.service';
import { DepartmentDomainFactory } from '@domain/department/factory';
import { DepartmentDomainService } from '@domain/department/service';
import { DepartmentRepository } from '@infrastructure/repository/department/repository.interface';
import { DepartmentManagerDomainFactory } from '@domain/department-manager/factory';
import { DepartmentManagerDomainService } from '@domain/department-manager/service';
import { DepartmentManagerRepository } from '@infrastructure/repository/department-manager/repository.interface';
import { DepartmentEmployeeRepository } from '@infrastructure/repository/department-employee/repository.interface';
import { mockDepartmentRepository } from '@infrastructure/repository/department/__mock__';
import { mockDepartmentManagerRepository } from '@infrastructure/repository/department-manager/__mock__';
import { mockDepartmentEmployeeRepository } from '@infrastructure/repository/department-employee/__mock__';
import { EmployeeRepository } from '@infrastructure/repository/employee/repository.interface';
import { mockEmployeeRepository } from '@infrastructure/repository/employee/__mock__';
import {
    ChangeManagerDto,
    CreateDepartmentDto,
    UpdateDepartmentDto,
} from './dto/request.dto';
import {
    DepartmentDto,
    DepartmentEmployeeDto,
    DepartmentManagerDto,
} from './dto/response.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Department } from '@domain/department/entity';
import { Employee } from '@domain/employee/entity';
import { PaginationDto } from '@core/base-request.dto';
import { PaginatedList } from '@core/base-response.dto';
import { DepartmentManager } from '@domain/department-manager/entity';
import { DepartmentEmployee } from '@domain/department-employee/entity';

describe('DepartmentApplicationService', () => {
    let departmentApplicationService: DepartmentApplicationService;
    let departmentDomainFactory: DepartmentDomainFactory;
    let departmentDomainService: DepartmentDomainService;
    let departmentManagerDomainFactory: DepartmentManagerDomainFactory;
    let departmentManagerDomainService: DepartmentManagerDomainService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                DepartmentApplicationService,
                DepartmentDomainFactory,
                DepartmentDomainService,
                {
                    provide: DepartmentRepository,
                    useValue: mockDepartmentRepository,
                },
                DepartmentManagerDomainFactory,
                DepartmentManagerDomainService,
                {
                    provide: DepartmentManagerRepository,
                    useValue: mockDepartmentManagerRepository,
                },
                {
                    provide: DepartmentEmployeeRepository,
                    useValue: mockDepartmentEmployeeRepository,
                },
                {
                    provide: EmployeeRepository,
                    useValue: mockEmployeeRepository,
                },
            ],
        }).compile();
        departmentApplicationService =
            moduleRef.get<DepartmentApplicationService>(
                DepartmentApplicationService,
            );
        departmentDomainFactory = moduleRef.get<DepartmentDomainFactory>(
            DepartmentDomainFactory,
        );
        departmentDomainService = moduleRef.get<DepartmentDomainService>(
            DepartmentDomainService,
        );
        departmentManagerDomainFactory =
            moduleRef.get<DepartmentManagerDomainFactory>(
                DepartmentManagerDomainFactory,
            );
        departmentManagerDomainService =
            moduleRef.get<DepartmentManagerDomainService>(
                DepartmentManagerDomainService,
            );
    });

    describe('create', () => {
        const correctDto = new CreateDepartmentDto();
        correctDto.departmentNo = 'd020';
        correctDto.departmentName = 'Infra Engineering';

        let create: jest.SpyInstance;
        let checkDuplicate: jest.SpyInstance;
        let findOneDepartment: jest.SpyInstance;
        let findOneEmployee: jest.SpyInstance;
        let save: jest.SpyInstance;

        beforeAll(() => {
            create = jest.spyOn(departmentDomainFactory, 'create');
            checkDuplicate = jest
                .spyOn(departmentDomainService, 'checkDuplicate')
                .mockResolvedValue();
            findOneDepartment = jest.spyOn(mockDepartmentRepository, 'findOne');
            findOneEmployee = jest.spyOn(mockEmployeeRepository, 'findOne');
            save = jest.spyOn(mockDepartmentRepository, 'save');
        });

        beforeEach(() => {
            create.mockClear();
            save.mockClear();
        });

        it('엔티티를 생성하고 영속화 해야 한다.', async () => {
            const department = new Department({
                departmentNo: correctDto.departmentNo,
                departmentName: correctDto.departmentName,
            });
            findOneDepartment.mockResolvedValue(department);
            const employee = new Employee({
                type: 'restore',
                employeeNo: 10000,
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
            await departmentApplicationService.create(correctDto);
            expect(create).toHaveBeenCalled();
            expect(checkDuplicate).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
        });
        it('DTO를 반환해야 한다.', async () => {
            const department = new Department({
                departmentNo: correctDto.departmentNo,
                departmentName: correctDto.departmentName,
            });
            findOneDepartment.mockResolvedValue(department);
            const employee = new Employee({
                type: 'restore',
                employeeNo: 10000,
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
            const result =
                await departmentApplicationService.create(correctDto);
            expect(result).toBeInstanceOf(DepartmentDto);
        });

        const wrongDto = new CreateDepartmentDto();
        wrongDto.departmentNo = 'd020';
        wrongDto.departmentName = null;

        it('파라미터가 잘못된 경우 에러를 발생시켜야 한다.', async () => {
            const department = new Department({
                departmentNo: correctDto.departmentNo,
                departmentName: correctDto.departmentName,
            });
            findOneDepartment.mockResolvedValue(department);
            const employee = new Employee({
                type: 'restore',
                employeeNo: 10000,
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
            await expect(
                departmentApplicationService.create(wrongDto),
            ).rejects.toThrow(BadRequestException);
            expect(save).not.toHaveBeenCalled();
        });
    });

    describe('update', () => {
        const departmentNo = 'd021';

        const correctDto = new UpdateDepartmentDto();
        correctDto.departmentName = 'Infra Engineering';

        let update: jest.SpyInstance;
        let findOne: jest.SpyInstance;

        beforeAll(() => {
            update = jest.spyOn(mockDepartmentRepository, 'update');
            findOne = jest.spyOn(mockDepartmentRepository, 'findOne');
        });

        beforeEach(() => {
            update.mockClear();
            findOne.mockClear();
        });

        it('엔티티를 업데이트하고 영속화 해야 한다.', async () => {
            const entity = new Department({
                departmentNo,
                departmentName: 'Frontend Development',
            });
            findOne.mockResolvedValue(entity);
            const updateEntity = jest.spyOn(entity, 'update');
            await departmentApplicationService.update(
                entity.departmentNo,
                correctDto,
            );
            expect(findOne).toHaveBeenCalled();
            expect(updateEntity).toHaveBeenCalled();
            expect(update).toHaveBeenCalled();
        });
        it('DTO를 반환해야 한다.', async () => {
            const entity = new Department({
                departmentNo,
                departmentName: 'Frontend Development',
            });
            findOne.mockResolvedValue(entity);
            const result = await departmentApplicationService.update(
                departmentNo,
                correctDto,
            );
            expect(result).toBeInstanceOf(DepartmentDto);
        });
        it('엔티티가 존재하지 않는다면 에러를 발생시켜야 한다.', async () => {
            findOne.mockResolvedValue(null);
            await expect(
                departmentApplicationService.update(departmentNo, correctDto),
            ).rejects.toThrow(NotFoundException);
        });

        const wrongDto = new UpdateDepartmentDto();
        wrongDto.departmentName = '#2_';

        it('파라미터가 잘못된 경우 에러를 발생시켜야 한다.', async () => {
            const department = new Department({
                departmentNo,
                departmentName: 'Frontend Development',
            });
            findOne.mockResolvedValue(department);
            await expect(
                departmentApplicationService.update(departmentNo, wrongDto),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('getDepartment', () => {
        const departmentNo = 'd020';

        const entity = new Department({
            departmentNo,
            departmentName: 'Backend Development',
        });

        let findOne: jest.SpyInstance;

        beforeAll(() => {
            findOne = jest.spyOn(mockDepartmentRepository, 'findOne');
        });

        it('DTO를 반환해야 한다.', async () => {
            findOne.mockResolvedValue(entity);
            const result =
                await departmentApplicationService.getDepartment(departmentNo);
            expect(result).toBeInstanceOf(DepartmentDto);
            expect(findOne).toHaveBeenCalled();
        });
        it('엔티티가 존재하지 않는다면 에러를 발생시켜야 한다.', async () => {
            findOne.mockResolvedValue(null);
            await expect(
                departmentApplicationService.getDepartment(departmentNo),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('getPaginatedDepartmentList', () => {
        const entities = Array.from(
            new Array(10),
            (_, index) =>
                new Department({
                    departmentNo: `d02${index}`,
                    departmentName: 'Test',
                }),
        );

        const dto = new PaginationDto();
        dto.page = 1;
        dto.limit = entities.length;

        let findMany: jest.SpyInstance;
        let count: jest.SpyInstance;

        beforeAll(() => {
            findMany = jest.spyOn(mockDepartmentRepository, 'findMany');
            count = jest.spyOn(mockDepartmentRepository, 'count');
        });

        beforeEach(() => {
            findMany.mockClear();
            count.mockClear();
        });

        it('PaginatedList를 반환해야 한다.', async () => {
            findMany.mockResolvedValue(entities);
            count.mockResolvedValue(entities.length);

            const result =
                await departmentApplicationService.getPaginatedDepartmentList(
                    dto,
                );
            expect(result).toBeInstanceOf(PaginatedList);
            expect(
                result.list.every((v) => v instanceof DepartmentDto),
            ).toBeTruthy();
        });
    });

    describe('getPaginatedDepartmentManagerList', () => {
        const departmentNo = 'd010';

        const entities = Array.from(
            new Array(10),
            (_, index) =>
                new DepartmentManager({
                    type: 'restore',
                    departmentNo,
                    employeeNo: index,
                    firstName: 'test',
                    lastName: 'test',
                    fromDate: new Date('2023-05-24'),
                    toDate: new Date('2024-07-12'),
                }),
        );

        const dto = new PaginationDto();
        dto.page = 1;
        dto.limit = entities.length;

        let findMany: jest.SpyInstance;
        let count: jest.SpyInstance;

        beforeAll(() => {
            findMany = jest.spyOn(mockDepartmentManagerRepository, 'findMany');
            count = jest.spyOn(mockDepartmentManagerRepository, 'count');
        });

        beforeEach(() => {
            findMany.mockClear();
            count.mockClear();
        });

        it('PaginatedList를 반환해야 한다.', async () => {
            findMany.mockResolvedValue(entities);
            count.mockResolvedValue(entities.length);

            const result =
                await departmentApplicationService.getPaginatedDepartmentManagerList(
                    departmentNo,
                    dto,
                );
            expect(result).toBeInstanceOf(PaginatedList);
            expect(
                result.list.every((v) => v instanceof DepartmentManagerDto),
            ).toBeTruthy();
        });
    });

    describe('changeManager', () => {
        const departmentNo = 'd010';

        const correctDto = new ChangeManagerDto();
        correctDto.employeeNo = 10000;
        correctDto.fromDate = new Date('2023-11-20');

        let findOneDepartment: jest.SpyInstance;
        let findOneEmployee: jest.SpyInstance;
        let create: jest.SpyInstance;
        let changeManager: jest.SpyInstance;
        let updateAll: jest.SpyInstance;

        beforeAll(() => {
            findOneDepartment = jest.spyOn(mockDepartmentRepository, 'findOne');
            findOneEmployee = jest.spyOn(mockEmployeeRepository, 'findOne');
            create = jest.spyOn(departmentManagerDomainFactory, 'create');
            changeManager = jest.spyOn(
                departmentManagerDomainService,
                'changeManager',
            );
            updateAll = jest.spyOn(
                mockDepartmentManagerRepository,
                'updateAll',
            );
        });

        it('엔티티를 업데이트하고 영속화 해야 한다.', async () => {
            const department = new Department({
                departmentNo,
                departmentName: 'Backend Development',
            });
            findOneDepartment.mockResolvedValue(department);
            const employee = new Employee({
                type: 'restore',
                employeeNo: 10000,
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
            changeManager.mockResolvedValue([
                new DepartmentManager({
                    type: 'create',
                    departmentNo: department.departmentNo,
                    employeeNo: employee.employeeNo,
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    fromDate: correctDto.fromDate,
                    toDate: new Date('9999-12-31'),
                }),
            ]);
            await departmentApplicationService.changeManager(
                departmentNo,
                correctDto,
            );
            expect(findOneDepartment).toHaveBeenCalled();
            expect(findOneEmployee).toHaveBeenCalled();
            expect(create).toHaveBeenCalled();
            expect(changeManager).toHaveBeenCalled();
            expect(updateAll).toHaveBeenCalled();
        });
        it('DTO를 반환해야 한다.', async () => {
            const department = new Department({
                departmentNo,
                departmentName: 'Backend Development',
            });
            findOneDepartment.mockResolvedValue(department);
            const employee = new Employee({
                type: 'restore',
                employeeNo: 10000,
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
            changeManager.mockResolvedValue([
                new DepartmentManager({
                    type: 'create',
                    departmentNo: department.departmentNo,
                    employeeNo: employee.employeeNo,
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    fromDate: correctDto.fromDate,
                    toDate: new Date('9999-12-31'),
                }),
            ]);
            const result = await departmentApplicationService.changeManager(
                departmentNo,
                correctDto,
            );
            expect(
                result.every((v) => v instanceof DepartmentManagerDto),
            ).toBeTruthy();
        });
        it('Department 엔티티가 존재하지 않는다면 에러를 발생시켜야 한다.', async () => {
            findOneDepartment.mockResolvedValue(null);
            const employee = new Employee({
                type: 'restore',
                employeeNo: 10000,
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
            await expect(
                departmentApplicationService.changeManager(
                    departmentNo,
                    correctDto,
                ),
            ).rejects.toThrow(NotFoundException);
        });
        it('Employee 엔티티가 존재하지 않는다면 에러를 발생시켜야 한다.', async () => {
            const department = new Department({
                departmentNo,
                departmentName: 'Backend Development',
            });
            findOneDepartment.mockResolvedValue(department);
            findOneEmployee.mockResolvedValue(null);
            await expect(
                departmentApplicationService.changeManager(
                    departmentNo,
                    correctDto,
                ),
            ).rejects.toThrow(BadRequestException);
        });

        const wrongDto = new ChangeManagerDto();
        wrongDto.employeeNo = correctDto.employeeNo;
        wrongDto.fromDate = null;

        it('파라미터가 잘못된 경우 에러를 발생시켜야 한다.', async () => {
            const department = new Department({
                departmentNo,
                departmentName: 'Backend Development',
            });
            findOneDepartment.mockResolvedValue(department);
            const employee = new Employee({
                type: 'restore',
                employeeNo: 10000,
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
            await expect(
                departmentApplicationService.changeManager(
                    departmentNo,
                    wrongDto,
                ),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('getPaginatedDepartmentEmployeeList', () => {
        const departmentNo = 'd010';

        const entities = Array.from(
            new Array(10),
            (_, index) =>
                new DepartmentEmployee({
                    type: 'restore',
                    departmentNo,
                    employeeNo: index,
                    firstName: 'test',
                    lastName: 'test',
                    fromDate: new Date('2023-05-24'),
                    toDate: new Date('2024-07-12'),
                }),
        );

        const dto = new PaginationDto();
        dto.page = 1;
        dto.limit = entities.length;

        let findMany: jest.SpyInstance;
        let count: jest.SpyInstance;

        beforeAll(() => {
            findMany = jest.spyOn(mockDepartmentEmployeeRepository, 'findMany');
            count = jest.spyOn(mockDepartmentEmployeeRepository, 'count');
        });

        beforeEach(() => {
            findMany.mockClear();
            count.mockClear();
        });

        it('PaginatedList를 반환해야 한다.', async () => {
            findMany.mockResolvedValue(entities);
            count.mockResolvedValue(count);
            const result =
                await departmentApplicationService.getPaginatedDepartmentEmployeeList(
                    departmentNo,
                    dto,
                );
            expect(result).toBeInstanceOf(PaginatedList);
            expect(
                result.list.every((v) => v instanceof DepartmentEmployeeDto),
            ).toBeTruthy();
        });
    });
});
