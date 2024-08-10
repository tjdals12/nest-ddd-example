import { Module } from '@nestjs/common';
import { DepartmentRepositoryModule } from '@infrastructure/repository/department/department-repository.module';
import { DepartmentDomainModule } from '@domain/department/department-domain.module';
import { DepartmentApplicationService } from './department-application.service';
import { DepartmentApplicationController } from './department-application.controller';
import { DepartmentManagerRepositoryModule } from '@infrastructure/repository/department-manager/department-manager-repository.module';
import { DepartmentManagerDomainModule } from '@domain/department-manager/department-manager-domain.module';
import { DepartmentEmployeeRepositoryModule } from '@infrastructure/repository/department-employee/department-employee-repository.module';
import { DepartmentEmployeeDomainModule } from '@domain/department-employee/department-employee-domain.module';

@Module({
    imports: [
        DepartmentRepositoryModule,
        DepartmentDomainModule,
        DepartmentManagerRepositoryModule,
        DepartmentManagerDomainModule,
        DepartmentEmployeeRepositoryModule,
        DepartmentEmployeeDomainModule,
    ],
    providers: [DepartmentApplicationService],
    controllers: [DepartmentApplicationController],
})
export class DepartmentApplicationModule {}
