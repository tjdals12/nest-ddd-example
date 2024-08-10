import { Module } from '@nestjs/common';
import { DepartmentEmployeeDomainFactory } from './factory';
import { DepartmentEmployeeRepositoryModule } from '@infrastructure/repository/department-employee/department-employee-repository.module';
import { EmployeeRepositoryModule } from '@infrastructure/repository/employee/employee-repository.module';

@Module({
    imports: [DepartmentEmployeeRepositoryModule, EmployeeRepositoryModule],
    providers: [DepartmentEmployeeDomainFactory],
    exports: [DepartmentEmployeeDomainFactory],
})
export class DepartmentEmployeeDomainModule {}
