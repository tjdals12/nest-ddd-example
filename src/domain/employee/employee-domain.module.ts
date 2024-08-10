import { Module } from '@nestjs/common';
import {
    DepartmentEmployeeDomainFactory,
    EmployeeDomainFactory,
    EmployeeTitleDomainFactory,
} from './factory';
import { EmployeeRepositoryModule } from '@infrastructure/repository/employee/employee-repository.module';
import { DepartmentRepositoryModule } from '@infrastructure/repository/department/department-repository.module';
import { EmployeeTitleRepositoryModule } from '@infrastructure/repository/employee-title/employee-title-repository.module';

@Module({
    imports: [
        EmployeeRepositoryModule,
        DepartmentRepositoryModule,
        EmployeeTitleRepositoryModule,
    ],
    providers: [
        EmployeeDomainFactory,
        DepartmentEmployeeDomainFactory,
        EmployeeTitleDomainFactory,
    ],
    exports: [
        EmployeeDomainFactory,
        DepartmentEmployeeDomainFactory,
        EmployeeTitleDomainFactory,
    ],
})
export class EmployeeDomainModule {}
