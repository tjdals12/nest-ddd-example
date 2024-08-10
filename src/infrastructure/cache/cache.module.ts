import { Global, Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { CONFIG_SERVICE_KEY } from '@infrastructure/config/interface';
import { ConfigService } from '@nestjs/config';
import {
    CACHE_CONFIG_KEY,
    CacheConfig,
} from '@infrastructure/config/interface/cache-config';

@Global()
@Module({
    imports: [
        NestCacheModule.registerAsync({
            inject: [CONFIG_SERVICE_KEY],
            useFactory: (configService: ConfigService) => {
                const cacheConfig =
                    configService.get<CacheConfig>(CACHE_CONFIG_KEY);

                return {
                    store: redisStore,
                    ttl: 5,
                    host: cacheConfig.DB_HOST,
                    port: cacheConfig.DB_PORT,
                };
            },
        }),
    ],
    exports: [NestCacheModule],
})
export class CacheModule {}
