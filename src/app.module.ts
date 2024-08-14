import { Module } from '@nestjs/common';
import { ConfigModule } from '@infrastructure/config/config.module';
import { RepositoryModule } from '@infrastructure/repository/repository.module';
import { CacheModule } from '@infrastructure/cache/cache.module';
import { UserApplicationModule } from '@application/user/user-application.module';
import { DepartmentApplicationModule } from '@application/department/department-application.module';
import { EmployeeApplicationModule } from '@application/employee/employee-application.module';
import { EmployeeSalaryApplicationModule } from '@application/employee-salary/employee-salary-application.module';
import { AccessLogApplicationModule } from '@application/access-log/access-log-application.module';

@Module({
    imports: [
        ConfigModule,
        RepositoryModule,
        CacheModule,
        UserApplicationModule,
        DepartmentApplicationModule,
        EmployeeApplicationModule,
        EmployeeSalaryApplicationModule,
        AccessLogApplicationModule,
    ],
})
export class AppModule {}
