import { Injectable } from '@nestjs/common';
import { DepartmentEmployee, DepartmentEmployeeProperty } from '../entity';
import { DepartmentRepository } from '@infrastructure/repository/department/repository.interface';

@Injectable()
export class DepartmentEmployeeDomainFactory {
    constructor(private departmentRepository: DepartmentRepository) {}

    async create(
        args: Pick<DepartmentEmployeeProperty, 'departmentNo' | 'fromDate'>,
    ) {
        const { departmentNo, fromDate } = args;
        const queryBuilder = this.departmentRepository.getQueryBuilder();
        queryBuilder.departmentNo.equals(departmentNo);
        const department =
            await this.departmentRepository.findOne(queryBuilder);
        if (department === null) throw new Error('Invalid departmentNo');
        const departmentEmployee = new DepartmentEmployee({
            type: 'create',
            departmentNo: department.departmentNo,
            departmentName: department.departmentName,
            fromDate,
            toDate: new Date('9999-12-31'),
        });
        return departmentEmployee;
    }
}
