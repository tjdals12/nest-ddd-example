import { Injectable } from '@nestjs/common';
import { Department, DepartmentProperty } from '../entity';

@Injectable()
export class DepartmentDomainFactory {
    create(args: Pick<DepartmentProperty, 'departmentNo' | 'departmentName'>) {
        const { departmentNo, departmentName } = args;
        const department = new Department({
            departmentNo,
            departmentName,
        });
        return department;
    }
}
