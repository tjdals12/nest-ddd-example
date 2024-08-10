import { Test } from '@nestjs/testing';
import { DepartmentManagerDomainService } from './department-manager-domain.service';
import { DepartmentManagerRepository } from '@infrastructure/repository/department-manager/repository.interface';
import { departmentManagerRepository } from '@infrastructure/repository/department-manager/__mock__';
import { DepartmentManager } from '../entity';

describe('DepartmentManagerDomainService', () => {
    let departmentManagerDomainService: DepartmentManagerDomainService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [DepartmentManagerDomainService],
        })
            .useMocker((token) => {
                if (token === DepartmentManagerRepository) {
                    return departmentManagerRepository;
                }
            })
            .compile();
        departmentManagerDomainService =
            moduleRef.get<DepartmentManagerDomainService>(
                DepartmentManagerDomainService,
            );
    });

    const maxDate = new Date('9999-12-31');

    const currentManager = new DepartmentManager({
        type: 'create',
        employeeNo: 1,
        departmentNo: 'd001',
        firstName: 'Smith',
        lastName: 'John',
        fromDate: new Date('2023-01-01'),
        toDate: maxDate,
    });

    const prevManager = new DepartmentManager({
        type: 'create',
        employeeNo: 2,
        departmentNo: 'd001',
        firstName: 'Harry',
        lastName: 'Wilson',
        fromDate: new Date('2023-10-27'),
        toDate: new Date('2024-05-12'),
    });
    const newManager = new DepartmentManager({
        type: 'create',
        employeeNo: 2,
        departmentNo: 'd001',
        firstName: 'Harry',
        lastName: 'Wilson',
        fromDate: new Date('2023-10-27'),
        toDate: maxDate,
    });

    describe('changeManager', () => {
        it('새로운 매니저를 추가해야 한다.', async () => {
            jest.spyOn(
                departmentManagerRepository,
                'findMany',
            ).mockResolvedValueOnce([]);
            const managers =
                await departmentManagerDomainService.changeManager(newManager);
            expect(managers).toHaveLength(1);
            expect(managers[0].employeeNo).toBe(newManager.employeeNo);
            expect(managers[0].toDate).toBe(maxDate);
        });

        it('기존 매니저의 날짜를 수정해야 한다.', async () => {
            jest.spyOn(
                departmentManagerRepository,
                'findMany',
            ).mockResolvedValueOnce([currentManager]);
            const managers =
                await departmentManagerDomainService.changeManager(newManager);
            expect(managers).toHaveLength(2);
            expect(
                managers.find((v) => v.employeeNo === currentManager.employeeNo)
                    .toDate,
            ).toBe(newManager.fromDate);
        });

        it('매니저 이력에 존재한다면 추가하지 않고 날짜만 수정해야 한다.', async () => {
            jest.spyOn(
                departmentManagerRepository,
                'findMany',
            ).mockResolvedValueOnce([currentManager, prevManager]);
            const managers =
                await departmentManagerDomainService.changeManager(newManager);
            expect(managers).toHaveLength(2);
            expect(
                managers.find((v) => v.employeeNo === newManager.employeeNo)
                    .toDate,
            ).toBe(maxDate);
        });
    });
});
