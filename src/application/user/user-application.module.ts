import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserRepositoryModule } from '@infrastructure/repository/user/user-repository.module';
import { UserDomainModule } from '@domain/user/user-domain.module';
import { UserApplicationService } from './user-application.service';
import { ConfigService } from '@nestjs/config';
import {
    COMMON_CONFIG_KEY,
    CommonConfig,
} from '@infrastructure/config/interface/common-config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtPassportStrategy } from './jwt-passport.strategy';
import { UserApplicationController } from './user-application.controller';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const commonConfig =
                    configService.get<CommonConfig>(COMMON_CONFIG_KEY);
                return {
                    secret: commonConfig.JWT_SECRET,
                };
            },
        }),
        UserRepositoryModule,
        UserDomainModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        JwtPassportStrategy,
        UserApplicationService,
    ],
    controllers: [UserApplicationController],
})
export class UserApplicationModule {}
