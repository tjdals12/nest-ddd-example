import { Injectable } from '@nestjs/common';
import { EmployeeTitle, EmployeeTitleProperty } from '../entity';

@Injectable()
export class EmployeeTitleDomainFactory {
    create(args: Pick<EmployeeTitleProperty, 'title' | 'fromDate'>) {
        const { title, fromDate } = args;
        const employeeTitle = new EmployeeTitle({
            type: 'create',
            title,
            fromDate,
            toDate: new Date('9999-12-31'),
        });
        return employeeTitle;
    }
}
