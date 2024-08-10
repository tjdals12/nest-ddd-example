import { Injectable } from '@nestjs/common';
import { DepartmentManager, DepartmentManagerProperty } from '../entity';
import { EmployeeRepository } from '@infrastructure/repository/employee/repository.interface';

@Injectable()
export class DepartmentManagerDomainFactory {
    constructor(private employeeRepository: EmployeeRepository) {}

    async create(
        args: Pick<
            DepartmentManagerProperty,
            'departmentNo' | 'employeeNo' | 'fromDate'
        >,
    ) {
        const { departmentNo, employeeNo, fromDate } = args;
        const queryBuilder = this.employeeRepository.getQueryBuilder();
        queryBuilder.employeeNo.equals(employeeNo);
        const employee = await this.employeeRepository.findOne(queryBuilder);
        if (employee === null) throw new Error('Invalid employeeNo');
        const departmentManager = new DepartmentManager({
            type: 'create',
            departmentNo,
            employeeNo: employee.employeeNo,
            firstName: employee.firstName,
            lastName: employee.lastName,
            fromDate,
            toDate: new Date('9999-12-31'),
        });
        return departmentManager;
    }
}
