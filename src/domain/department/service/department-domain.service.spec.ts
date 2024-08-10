import { Test } from '@nestjs/testing';
import { DepartmentDomainService } from './department-domain.service';
import { DepartmentRepository } from '@infrastructure/repository/department/repository.interface';
import { departmentRepository } from '@infrastructure/repository/department/__mock__';
import { Department } from '../entity';

describe('DepartmentDomainService', () => {
    let departmentDomainService: DepartmentDomainService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [DepartmentDomainService],
        })
            .useMocker((token) => {
                if (token === DepartmentRepository) {
                    return departmentRepository;
                }
            })
            .compile();
        departmentDomainService = moduleRef.get<DepartmentDomainService>(
            DepartmentDomainService,
        );
    });

    const department = new Department({
        departmentNo: 'd001',
        departmentName: 'Frontend Development',
    });

    describe('checkDuplicate', () => {
        it('중복될 경우 예외를 발생시켜야 한다.', async () => {
            jest.spyOn(departmentRepository, 'findOne').mockResolvedValue(
                department,
            );
            await expect(
                departmentDomainService.checkDuplicate(department),
            ).rejects.toThrow();
        });
        it('중복되지 않을 경우 예외를 발생시키지 않아야 한다.', async () => {
            jest.spyOn(departmentRepository, 'findOne').mockResolvedValue(null);
            await expect(
                departmentDomainService.checkDuplicate(department),
            ).resolves.not.toThrow();
        });
    });
});