import { Module } from '@nestjs/common';
import { DepartmentEmployeeRepositoryModule } from '@infrastructure/repository/department-employee/department-employee-repository.module';
import { EmployeeRepositoryModule } from '@infrastructure/repository/employee/employee-repository.module';

@Module({
    imports: [DepartmentEmployeeRepositoryModule, EmployeeRepositoryModule],
})
export class DepartmentEmployeeDomainModule {}
