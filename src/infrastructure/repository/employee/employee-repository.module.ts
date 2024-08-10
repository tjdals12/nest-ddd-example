import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee, MysqlEmployeeRepository } from './mysql';
import { EmployeeRepository } from './repository.interface';

@Module({
    imports: [TypeOrmModule.forFeature([Employee])],
    providers: [
        {
            provide: EmployeeRepository,
            useClass: MysqlEmployeeRepository,
        },
    ],
    exports: [EmployeeRepository],
})
export class EmployeeRepositoryModule {}
