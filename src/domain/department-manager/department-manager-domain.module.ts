import { Module } from '@nestjs/common';
import { DepartmentManagerDomainFactory } from './factory';
import { DepartmentManagerDomainService } from './service';
import { EmployeeRepositoryModule } from '@infrastructure/repository/employee/employee-repository.module';
import { DepartmentManagerRepositoryModule } from '@infrastructure/repository/department-manager/department-manager-repository.module';

@Module({
    imports: [
        DepartmentManagerRepositoryModule,
        EmployeeRepositoryModule,
        DepartmentManagerRepositoryModule,
    ],
    providers: [DepartmentManagerDomainFactory, DepartmentManagerDomainService],
    exports: [DepartmentManagerDomainFactory, DepartmentManagerDomainService],
})
export class DepartmentManagerDomainModule {}
