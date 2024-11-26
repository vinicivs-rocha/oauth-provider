import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ValidateAuthorizationCode } from 'src/user/application/usecases/validate-authorization-code.usecase';

@Injectable()
export class ValidateAuthorizationCodeGuard implements CanActivate {
  constructor(private validateAuthorizationCode: ValidateAuthorizationCode) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const code = req.query.code;
    const project = req['project'];

    const result = await this.validateAuthorizationCode.execute({
      code,
      project,
    });

    req['user'] = result.user;
    req['token'] = code;

    return true;
  }
}
