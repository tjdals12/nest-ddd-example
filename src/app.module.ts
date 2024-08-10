import { Module } from '@nestjs/common';
import { DotenvConfigModule } from '@infrastructure/config/dotenv/dotenv-config.module';
import { RepositoryModule } from '@infrastructure/repository/repository.module';
import { CacheModule } from '@infrastructure/cache/cache.module';
import { UserApplicationModule } from '@application/user/user-application.module';
import { DepartmentApplicationModule } from '@application/department/department-application.module';
import { EmployeeApplicationModule } from '@application/employee/employee-application.module';
import { EmployeeSalaryApplicationModule } from '@application/employee-salary/employee-salary-application.module';

@Module({
    imports: [
        DotenvConfigModule,
        RepositoryModule,
        CacheModule,
        UserApplicationModule,
        DepartmentApplicationModule,
        EmployeeApplicationModule,
        EmployeeSalaryApplicationModule,
    ],
})
export class AppModule {}
