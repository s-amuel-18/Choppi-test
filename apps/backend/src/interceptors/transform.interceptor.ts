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

    console.log(`🔄 Interceptor ejecutándose para ${method} ${url}`);

    const call$ = next.handle();

    return (call$ as any).pipe(
      map((data: any) => {
        console.log('📦 Datos recibidos en interceptor:', JSON.stringify(data));

        // Si la respuesta ya tiene el formato ApiResponse, la devolvemos tal cual
        if (this.isApiResponse(data)) {
          console.log('✅ Respuesta ya tiene formato ApiResponse');
          return data;
        }

        // Si la respuesta es null o undefined, devolvemos un formato estándar
        if (data === null || data === undefined) {
          console.log(
            '⚠️ Respuesta es null/undefined, devolviendo formato estándar',
          );
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

        console.log('✨ Respuesta transformada:', JSON.stringify(transformed));
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
