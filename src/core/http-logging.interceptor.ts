import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import { AccessLogRepository } from '@infrastructure/repository/access-log/repository.interface';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
    private logger = new Logger('HTTP');
    constructor(private accessLogRepository: AccessLogRepository) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const { method, originalUrl, ip, path, user } = request;
        const userAgent = request.get('user-agent');
        const { statusCode } = response;

        if (user) {
            try {
                this.accessLogRepository.save({
                    path: `${method} ${path}`,
                    userId: user.userId,
                    date: new Date(),
                });
            } catch (e) {
                console.log(e);
            }
        }

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
