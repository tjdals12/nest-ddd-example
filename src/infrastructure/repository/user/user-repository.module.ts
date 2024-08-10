import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, MysqlUserRepository } from './mysql';
import { UserRepository } from './repository.interface';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [
        {
            provide: UserRepository,
            useClass: MysqlUserRepository,
        },
    ],
    exports: [UserRepository],
})
export class UserRepositoryModule {}
