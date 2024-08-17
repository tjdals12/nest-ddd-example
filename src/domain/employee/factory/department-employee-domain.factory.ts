import { Injectable } from '@nestjs/common';
import { DepartmentEmployee, DepartmentEmployeeProperty } from '../entity';

@Injectable()
export class DepartmentEmployeeDomainFactory {
    async create(
        args: Pick<
            DepartmentEmployeeProperty,
            'departmentNo' | 'departmentName' | 'fromDate'
        >,
    ) {
        const { departmentNo, departmentName, fromDate } = args;
        const departmentEmployee = new DepartmentEmployee({
            type: 'create',
            departmentNo,
            departmentName,
            fromDate,
            toDate: new Date('9999-12-31'),
        });
        return departmentEmployee;
    }
}
