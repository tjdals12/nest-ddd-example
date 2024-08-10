import { Injectable } from '@nestjs/common';
import { Department } from '../entity';
import { DepartmentRepository } from '@infrastructure/repository/department/repository.interface';

@Injectable()
export class DepartmentDomainService {
    constructor(private departmentRepository: DepartmentRepository) {}

    async checkDuplicate(department: Department): Promise<void> {
        const queryBuilder1 = this.departmentRepository.getQueryBuilder();
        queryBuilder1.departmentNo.equals(department.departmentNo);
        const found1 = await this.departmentRepository.findOne(queryBuilder1);
        if (found1 !== null) throw new Error();

        const queryBuilder2 = this.departmentRepository.getQueryBuilder();
        queryBuilder2.departmentName.equals(department.departmentName);
        const found2 = await this.departmentRepository.findOne(queryBuilder2);
        if (found2 !== null) throw new Error();
    }
}
