import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { validationSchema } from './interface';
import { ConfigLoader } from './interface';
import { DotenvLoader } from './dotenv';

@Global()
@Module({
    providers: [
        {
            provide: ConfigLoader,
            useClass: DotenvLoader,
        },
        {
            provide: ConfigService,
            inject: [ConfigLoader],
            useFactory: async (configLoader: ConfigLoader) => {
                const configVariables = await configLoader.load();
                const { error, value: validatedConfigVariables } =
                    validationSchema.validate(configVariables, {
                        abortEarly: true,
                    });
                if (error) {
                    throw new Error(
                        `Config validation error: ${error.message}`,
                    );
                }
                return new ConfigService(validatedConfigVariables);
            },
        },
    ],
    exports: [ConfigService],
})
export class ConfigModule {}
