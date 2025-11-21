import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

/**
 * Interceptor global que transforma todas las respuestas exitosas
 * al formato estándar ApiResponse<T> definido en @choppi/types
 *
 * Este interceptor:
 * - Envuelve respuestas exitosas en formato ApiResponse<T>
 * - Mantiene el formato de respuestas que ya son ApiResponse
 * - No modifica respuestas de error (se manejan con exception filters)
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): any {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    const call$ = next.handle();

    return (call$ as any).pipe(
      map((data: any) => {
        // Si la respuesta ya tiene el formato ApiResponse, la devolvemos tal cual
        if (this.isApiResponse(data)) {
          return data;
        }

        // Si la respuesta es null o undefined, devolvemos un formato estándar
        if (data === null || data === undefined) {
          return {
            success: true,
            message: 'Operación exitosa',
          };
        }

        // Transformamos la respuesta al formato ApiResponse<T>
        const transformed = {
          success: true,
          data,
        };

        return transformed;
      }),
    );
  }

  /**
   * Verifica si la respuesta ya tiene el formato ApiResponse
   */
  private isApiResponse(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      'success' in data &&
      typeof data.success === 'boolean'
    );
  }
}
