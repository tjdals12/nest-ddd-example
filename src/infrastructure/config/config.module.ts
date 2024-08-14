import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { validationSchema } from './interface';
import { loadConfigVariables } from './dotenv';

@Global()
@Module({
    providers: [
        {
            provide: ConfigService,
            useFactory: async () => {
                const configVariables = await loadConfigVariables(
                    `${__dirname}/dotenv/.env.${process.env.NODE_ENV}`,
                );
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
