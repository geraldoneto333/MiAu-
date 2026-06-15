import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

/** Compatível com formato de erro do FastAPI ({ detail: string }). */
@Catch(HttpException)
export class FastApiExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let detail: string;
    if (typeof exceptionResponse === 'string') {
      detail = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const msg = (exceptionResponse as { message?: string | string[] }).message;
      detail = Array.isArray(msg) ? msg[0] : (msg ?? exception.message);
    } else {
      detail = exception.message;
    }

    response.status(status).json({ detail });
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const filter = new FastApiExceptionFilter();
      filter.catch(exception, host);
      return;
    }

    const message =
      exception instanceof Error ? exception.message : 'Erro interno do servidor';
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ detail: message });
  }
}
