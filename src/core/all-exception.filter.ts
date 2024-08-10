import { DomainException } from '@domain/__shared__/domain-exception';
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    private logger = new Logger('HTTP');

    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
    catch(exception: any, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const { method, originalUrl, ip } = request;
        const userAgent = request.get('user-agent');

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        if (exception instanceof DomainException) {
            statusCode = HttpStatus.BAD_REQUEST;
            message = 'Bad request';
        } else if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            message = exception.message;
        }

        const responseBody = {
            statusCode,
            message,
        };

        this.logger.error(
            `${method} ${originalUrl} ${statusCode} - ${userAgent} ${ip}`,
        );

        httpAdapter.reply(response, responseBody, statusCode);
    }
}
