import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ValidateAccessToken } from 'src/user/application/usecases/validate-access-token.usecase';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private validateAccessToken: ValidateAccessToken) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = req.headers['authorization']?.split(' ')[1];

    const result = await this.validateAccessToken.execute({
      token,
    });

    req['user'] = result.user;
    req['token'] = token;

    return true;
  }
}
