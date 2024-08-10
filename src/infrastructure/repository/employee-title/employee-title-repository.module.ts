import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeTitle } from './mysql';

@Module({
    imports: [TypeOrmModule.forFeature([EmployeeTitle])],
})
export class EmployeeTitleRepositoryModule {}
