import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Kiểm tra nếu exception là HttpException thì lấy status code
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // Trả về response JSON
    response.status(status).json({
      statusCode: status,
      message: (exception instanceof HttpException)
        ? exception.getResponse()
        : 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
}
