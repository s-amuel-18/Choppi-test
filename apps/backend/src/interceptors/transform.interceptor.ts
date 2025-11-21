import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): any {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    const call$ = next.handle();

    return (call$ as any).pipe(
      map((data: any) => {
        if (this.isApiResponse(data)) {
          return data;
        }

        if (data === null || data === undefined) {
          return {
            success: true,
            message: 'Operación exitosa',
          };
        }

        const transformed = {
          success: true,
          data,
        };

        return transformed;
      }),
    );
  }

  private isApiResponse(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      'success' in data &&
      typeof data.success === 'boolean'
    );
  }
}
