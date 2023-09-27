import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';

import { Observable, map } from 'rxjs';

export interface Response<T> {
  message: string;
  success: boolean;
  result: T;
  error: null;
  timestamp: Date;
  statusCode: number;
}

export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<Response<T>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    const path = context.switchToHttp().getRequest().url;
    return next.handle().pipe(
      map((data) => ({
        message: data.message,
        success: data.success,
        result: data.result,
        timestamp: new Date(),
        statusCode,
        path,
        error: null,
      })),
    );
  }
}
