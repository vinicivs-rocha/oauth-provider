import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { VerifyProject } from 'src/project/application/usecases/verify-project.usecase';

@Injectable()
export class ProjectVerificationGuard implements CanActivate {
  constructor(private verifyProject: VerifyProject) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const result = await this.verifyProject.execute({
      projectId: req.query.projectId,
      scope: req.query.scope,
      redirectUrl: req.query.redirectUrl,
    });

    req['project'] = result.project;

    return true;
  }
}
