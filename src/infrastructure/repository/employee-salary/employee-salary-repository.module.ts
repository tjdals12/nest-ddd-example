import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeSalary } from './mysql/employee-salary.model';
import { EmployeeSalaryRepository } from './repository.interface';
import { MysqlEmployeeSalaryRepository } from './mysql/employee-salary.repository';

@Module({
    imports: [TypeOrmModule.forFeature([EmployeeSalary])],
    providers: [
        {
            provide: EmployeeSalaryRepository,
            useClass: MysqlEmployeeSalaryRepository,
        },
    ],
    exports: [EmployeeSalaryRepository],
})
export class EmployeeSalaryRepositoryModule {}
