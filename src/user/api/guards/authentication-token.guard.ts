import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ValidateAuthenticationToken } from 'src/user/application/usecases/valdiate-authentication-token.usecase';

@Injectable()
export class AuthenticationTokenGuard implements CanActivate {
  constructor(private authenticateToken: ValidateAuthenticationToken) {}
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
