import { Module } from '@nestjs/common';
import { EmployeeDomainModule } from '@domain/employee/employee-domain.module';
import { EmployeeRepositoryModule } from '@infrastructure/repository/employee/employee-repository.module';
import { EmployeeApplicationService } from './employee-application.service';
import { EmployeeApplicationController } from './employee-application.controller';
import { EmployeeSalaryRepositoryModule } from '@infrastructure/repository/employee-salary/employee-salary-repository.module';
import { DepartmentRepositoryModule } from '@infrastructure/repository/department/department-repository.module';

@Module({
    imports: [
        EmployeeDomainModule,
        EmployeeRepositoryModule,
        EmployeeSalaryRepositoryModule,
        DepartmentRepositoryModule,
    ],
    providers: [EmployeeApplicationService],
    controllers: [EmployeeApplicationController],
})
export class EmployeeApplicationModule {}
