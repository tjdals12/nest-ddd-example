import { EmployeeSalaryRepositoryModule } from '@infrastructure/repository/employee-salary/employee-salary-repository.module';
import { Module } from '@nestjs/common';
import { EmployeeSalaryApplicationService } from './employee-salary-application.service';
import { EmployeeSalaryApplicationController } from './employee-salary-application.controller';

@Module({
    imports: [EmployeeSalaryRepositoryModule],
    controllers: [EmployeeSalaryApplicationController],
    providers: [EmployeeSalaryApplicationService],
    exports: [EmployeeSalaryApplicationService],
})
export class EmployeeSalaryApplicationModule {}
