import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedList, BaseResponse } from './base-response.dto';

export const ApiPaginatedResponse = <GenericType extends Type<unknown>>(args: {
    status: HttpStatus;
    type: GenericType;
}) =>
    applyDecorators(
        ApiExtraModels(PaginatedList, args.type),
        ApiResponse({
            status: args.status,
            schema: {
                allOf: [
                    {
                        properties: {
                            statusCode: {
                                type: 'number',
                                example: args.status,
                            },
                            message: {
                                type: 'string',
                                example: 'Ok',
                            },
                            data: {
                                allOf: [
                                    { $ref: getSchemaPath(PaginatedList) },
                                    {
                                        properties: {
                                            list: {
                                                type: 'array',
                                                items: {
                                                    $ref: getSchemaPath(
                                                        args.type,
                                                    ),
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
        }),
    );

export const ApiBaseResponse = <GenericType extends Type<unknown>>(args: {
    status: HttpStatus;
    type?: GenericType;
    isArray?: boolean;
}) =>
    applyDecorators(
        args.type
            ? ApiExtraModels(BaseResponse, args.type)
            : ApiExtraModels(BaseResponse),
        ApiResponse({
            status: args.status,
            schema: {
                allOf: [
                    {
                        properties: {
                            statusCode: {
                                type: 'number',
                                example: args.status,
                            },
                            message: {
                                type: 'string',
                                example: 'Ok',
                            },
                        },
                    },
                    args.type && {
                        properties: {
                            data: args.isArray
                                ? {
                                      type: 'array',
                                      items: {
                                          $ref: getSchemaPath(args.type),
                                      },
                                  }
                                : {
                                      $ref: getSchemaPath(args.type),
                                  },
                        },
                    },
                ],
            },
        }),
    );

export const ApiBadRequestException = () =>
    applyDecorators(
        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            schema: {
                properties: {
                    statusCode: {
                        type: 'number',
                        example: 400,
                    },
                    message: {
                        type: 'string',
                        example: 'Bad request',
                    },
                },
            },
        }),
    );

export const ApiUnauthorizedException = () =>
    applyDecorators(
        ApiResponse({
            status: HttpStatus.UNAUTHORIZED,
            schema: {
                properties: {
                    statusCode: {
                        type: 'number',
                        example: 401,
                    },
                    message: {
                        type: 'string',
                        example: 'Unauthorized',
                    },
                },
            },
        }),
    );

export const ApiNotFoundException = () =>
    applyDecorators(
        ApiResponse({
            status: HttpStatus.NOT_FOUND,
            schema: {
                properties: {
                    statusCode: {
                        type: 'number',
                        example: 404,
                    },
                    message: {
                        type: 'string',
                        example: 'Not found',
                    },
                },
            },
        }),
    );

export const ApiInternalServerException = () =>
    applyDecorators(
        ApiResponse({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            schema: {
                properties: {
                    statusCode: {
                        type: 'number',
                        example: 500,
                    },
                    message: {
                        type: 'string',
                        example: 'Internal server error',
                    },
                },
            },
        }),
    );
