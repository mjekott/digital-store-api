import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

export interface HttpExceptionResponse {
  statusCode: number;
  message: string;
  error: string;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapter: HttpAdapterHost) {}
  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapter;
    const ctx = host.switchToHttp();
    const exceptionResponse =
      exception instanceof HttpException
        ? ctx.getResponse().message
        : String(exception);
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: status,
      timeStamp: new Date().toISOString(),
      path: request.url,
      message: exceptionResponse || 'Something went wrong',
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
