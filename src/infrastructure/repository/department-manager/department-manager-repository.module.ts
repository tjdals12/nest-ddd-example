import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentManager } from './mysql';
import { DepartmentManagerRepository } from './repository.interface';
import { MysqlDepartmentManagerRepository } from './mysql/department-manager.repository';

@Module({
    imports: [TypeOrmModule.forFeature([DepartmentManager])],
    providers: [
        {
            provide: DepartmentManagerRepository,
            useClass: MysqlDepartmentManagerRepository,
        },
    ],
    exports: [DepartmentManagerRepository],
})
export class DepartmentManagerRepositoryModule {}
