import {
    SetMetadata,
    createParamDecorator,
    ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export const IS_PUBLIC_KEY = 'IS_PUBLIC';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const Cookies = createParamDecorator(
    (key: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request>();
        return key ? request.cookies?.[key] : request.cookies;
    },
);

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request>();
        return request.user;
    },
);
