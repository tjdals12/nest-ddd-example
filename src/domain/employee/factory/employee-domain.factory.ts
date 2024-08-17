import { Injectable } from '@nestjs/common';
import { Employee, EmployeProperty } from '../entity';

@Injectable()
export class EmployeeDomainFactory {
    create(
        args: Omit<
            EmployeProperty,
            'type' | 'employeeNo' | 'departments' | 'titles' | 'latestSalary'
        >,
    ): Employee {
        const { firstName, lastName, gender, birthDate, hireDate } = args;
        const employee = new Employee({
            type: 'create',
            employeeNo: null,
            firstName,
            lastName,
            gender,
            birthDate,
            hireDate,
            departments: [],
            titles: [],
            latestSalary: null,
        });
        return employee;
    }
}
