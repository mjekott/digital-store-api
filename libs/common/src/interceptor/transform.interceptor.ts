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
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    if (request.body) {
      for (const key in request.body) {
        if (typeof request.body[key] == 'string') {
          request.body[key] = request.body[key].trim();
          if (request.body[key].length == 0) {
            request.body[key] = null;
          }
        }
      }
    }

    //response.status = false;
    return next.handle().pipe(
      map((data) => {
        if (data?.status && data?.message && !data?.data) {
          return {
            status: data.status,
            statusCode: context.switchToHttp().getResponse().statusCode,
            message: data.message,
          };
        }
        if (data?.status && data?.message && data?.data) {
          return {
            status: data.status,
            statusCode: context.switchToHttp().getResponse().statusCode,
            message: data.message,
            data: data.data,
          };
        }
        return data;
      }),
    );
  }
}
