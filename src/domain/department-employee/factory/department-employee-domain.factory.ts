import { Injectable } from '@nestjs/common';
import { DepartmentEmployee, DepartmentEmployeeProperty } from '../entity';
import { EmployeeRepository } from '@infrastructure/repository/employee/repository.interface';

@Injectable()
export class DepartmentEmployeeDomainFactory {
    constructor(private employeeRepository: EmployeeRepository) {}

    async create(
        args: Pick<
            DepartmentEmployeeProperty,
            'departmentNo' | 'employeeNo' | 'fromDate'
        >,
    ): Promise<DepartmentEmployee> {
        const { departmentNo, employeeNo, fromDate } = args;
        const queryBuilder = this.employeeRepository.getQueryBuilder();
        queryBuilder.employeeNo.equals(employeeNo);
        const employee = await this.employeeRepository.findOne(queryBuilder);
        if (employee === null) throw new Error('Invalid employeeNo');
        const departmentEmployee = new DepartmentEmployee({
            type: 'create',
            departmentNo: departmentNo,
            employeeNo: employee.employeeNo,
            firstName: employee.firstName,
            lastName: employee.lastName,
            fromDate,
            toDate: new Date('9999-12-31'),
        });
        return departmentEmployee;
    }
}
