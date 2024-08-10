import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
    private logger = new Logger('HTTP');

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const { method, originalUrl, ip } = request;
        const userAgent = request.get('user-agent');
        const { statusCode } = response;

        return next
            .handle()
            .pipe(
                tap(() =>
                    this.logger.log(
                        `${method} ${originalUrl} ${statusCode} - ${userAgent} ${ip}`,
                    ),
                ),
            );
    }
}
