import { Injectable } from '@nestjs/common';
import { DepartmentManager, DepartmentManagerProperty } from '../entity';

@Injectable()
export class DepartmentManagerDomainFactory {
    create(
        args: Pick<
            DepartmentManagerProperty,
            | 'departmentNo'
            | 'employeeNo'
            | 'firstName'
            | 'lastName'
            | 'fromDate'
        >,
    ): DepartmentManager {
        const { departmentNo, employeeNo, firstName, lastName, fromDate } =
            args;
        const departmentManager = new DepartmentManager({
            type: 'create',
            departmentNo,
            employeeNo,
            firstName,
            lastName,
            fromDate,
            toDate: new Date('9999-12-31'),
        });
        return departmentManager;
    }
}
