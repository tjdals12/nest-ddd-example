import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { DepartmentManager } from '../entity';
import { DepartmentManagerRepository } from '@infrastructure/repository/department-manager/repository.interface';

@Injectable()
export class DepartmentManagerDomainService {
    constructor(
        private departmentManagerRepository: DepartmentManagerRepository,
    ) {}

    async changeManager(
        manager: DepartmentManager,
    ): Promise<DepartmentManager[]> {
        const queryBuilder = this.departmentManagerRepository.getQueryBuilder();
        queryBuilder.departmentNo.equals(manager.departmentNo);
        const managers = await this.departmentManagerRepository.findMany({
            queryBuilder,
        });

        const lastManager = managers.find((v) =>
            moment(v.toDate).isSameOrAfter(manager.fromDate),
        );
        if (lastManager) {
            lastManager.update({ toDate: manager.fromDate });
        }

        const sameManager = managers.find(
            (v) => v.employeeNo === manager.employeeNo,
        );
        if (sameManager) {
            sameManager.update({ toDate: manager.toDate });
        } else {
            managers.push(manager);
        }

        return managers;
    }
}
