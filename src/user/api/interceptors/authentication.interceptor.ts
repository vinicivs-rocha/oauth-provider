import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { User } from 'src/user/domain/entities/user';

@Injectable()
export class AuthenticationInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<AuthenticationResult>,
  ): Observable<any> {
    return next.handle().pipe(
      map((result) => {
        const response: Response = context.switchToHttp().getResponse();

        response.header('x-auth', result.token);

        return {
          token: result.token,
          name: result.user.name,
        };
      }),
    );
  }
}

export interface AuthenticationResult {
  token: string;
  user: User;
}
