import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { CONFIG_SERVICE_KEY } from '@infrastructure/config/interface';
import {
    COMMON_CONFIG_KEY,
    CommonConfig,
} from '@infrastructure/config/interface/common-config';
import { AllExceptionFilter } from './core/all-exception.filter';
import { TransformInterceptor } from '@core/transform.interceptor';
import { HttpLoggingInterceptor } from './core/http-logging.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.use(helmet());
    app.enableCors({
        origin: '',
        exposedHeaders: ['x-access-token'],
        credentials: true,
    });
    app.enableVersioning({
        type: VersioningType.URI,
    });
    app.useGlobalInterceptors(new HttpLoggingInterceptor());
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    const httpAdapterHost = app.get<HttpAdapterHost>(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionFilter(httpAdapterHost));
    const configService = app.get<ConfigService>(CONFIG_SERVICE_KEY);
    const commonConfig = configService.get<CommonConfig>(COMMON_CONFIG_KEY);
    if (commonConfig.NODE_ENV !== 'production') {
        const config = new DocumentBuilder()
            .setTitle('API')
            .setDescription('API Description')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api', app, document);
    }
    await app.listen(3000);
}
bootstrap();
