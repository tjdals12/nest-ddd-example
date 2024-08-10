import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentEmployee } from './mysql';
import { DepartmentEmployeeRepository } from './repository.interface';
import { MysqlDepartmentEmployeeRepository } from './mysql/department-employee.repository';

@Module({
    imports: [TypeOrmModule.forFeature([DepartmentEmployee])],
    providers: [
        {
            provide: DepartmentEmployeeRepository,
            useClass: MysqlDepartmentEmployeeRepository,
        },
    ],
    exports: [DepartmentEmployeeRepository],
})
export class DepartmentEmployeeRepositoryModule {}
