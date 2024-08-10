import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department, MysqlDepartmentRepository } from './mysql';
import { DepartmentRepository } from './repository.interface';

@Module({
    imports: [TypeOrmModule.forFeature([Department])],
    providers: [
        {
            provide: DepartmentRepository,
            useClass: MysqlDepartmentRepository,
        },
    ],
    exports: [DepartmentRepository],
})
export class DepartmentRepositoryModule {}
