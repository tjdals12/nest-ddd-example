import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import {
    CommonConfig,
    COMMON_CONFIG_KEY,
} from '@infrastructure/config/interface/common-config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtPassportStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {
        const commonConfig = configService.get<CommonConfig>(COMMON_CONFIG_KEY);
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: commonConfig.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        const refreshToken = await this.cacheManager.get(
            `refreshToken:${payload.sub}`,
        );
        if (refreshToken === null) return false;
        return { userId: payload.sub, userName: payload.name };
    }
}
