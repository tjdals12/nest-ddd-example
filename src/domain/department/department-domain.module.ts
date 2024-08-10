import { Module } from '@nestjs/common';
import { DepartmentDomainFactory } from './factory';
import { DepartmentDomainService } from './service';
import { DepartmentRepositoryModule } from '@infrastructure/repository/department/department-repository.module';

@Module({
    imports: [DepartmentRepositoryModule],
    providers: [DepartmentDomainFactory, DepartmentDomainService],
    exports: [DepartmentDomainFactory, DepartmentDomainService],
})
export class DepartmentDomainModule {}
