import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticateToken } from 'src/user/application/usecases/authenticate-token.usecase';

@Injectable()
export class AuthenticationTokenGuard implements CanActivate {
  constructor(private authenticateToken: AuthenticateToken) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.query['authenticationToken'] as string | undefined;

    const result = await this.authenticateToken.execute({
      token,
    });

    request['user'] = result.user;
    request['token'] = token;

    return true;
  }
}
