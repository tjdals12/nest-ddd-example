import { Module } from '@nestjs/common';
import { UserRepositoryModule } from '@infrastructure/repository/user/user-repository.module';
import { UserDomainFactory } from './factory';
import { UserDomainService } from './service';

@Module({
    imports: [UserRepositoryModule],
    providers: [UserDomainFactory, UserDomainService],
    exports: [UserDomainFactory, UserDomainService],
})
export class UserDomainModule {}
