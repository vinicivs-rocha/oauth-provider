import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { ProjectRepository } from 'src/project/application/repositories/project.repository';
import { Project } from 'src/project/domain/entities/project';
import { User } from 'src/user/domain/entities/user';
import { JWTGateway } from '../gateways/jwt.gateway';
import { UserRepository } from '../repositories/user.repository';

export namespace ValidateAuthorizationCode {
  export interface Input {
    code?: string;
    project?: Project;
  }

  export interface Output {
    user: User;
  }
}

@Injectable()
export class ValidateAuthorizationCode {
  constructor(
    private jwtGateway: JWTGateway,
    private userRepository: UserRepository,
    private projectRepository: ProjectRepository,
  ) {}

  async execute(
    input: ValidateAuthorizationCode.Input,
  ): Promise<ValidateAuthorizationCode.Output> {
    if (!input.code) {
      throw new Error('Code not provided');
    }

    if (!input.project) {
      throw new Error('Project not provided');
    }

    const decodedToken = await this.jwtGateway.verify<{
      access: string;
      id: UUID;
      projectId: UUID;
      projectSecret: string;
      scope: string;
    }>(input.code);

    const user = await this.userRepository.findByToken({
      access: 'oauth',
      token: input.code,
      id: decodedToken.id,
    });

    if (!user) {
      throw new Error('User not found');
    }

    const tokenProject = await this.projectRepository.findOne({
      id: decodedToken.projectId,
    });

    if (!tokenProject) {
      throw new Error('Project not found');
    }

    if (
      input.project.id !== tokenProject.id ||
      input.project.secret !== tokenProject.secret ||
      input.project.scope !== tokenProject.scope
    ) {
      throw new Error('Invalid project');
    }

    return { user };
  }
}
