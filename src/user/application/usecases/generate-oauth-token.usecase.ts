import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { ProjectRepository } from 'src/project/application/repositories/project.repository';
import { JWTGateway } from '../gateways/jwt.gateway';
import { UserRepository } from '../repositories/user.repository';

export namespace GenerateOAuthToken {
  export interface Input {
    userId: UUID;
    projectId: UUID;
  }

  export interface Output {
    authorizationCode: string;
  }
}

@Injectable()
export class GenerateOAuthToken {
  constructor(
    private userRepository: UserRepository,
    private projectRepository: ProjectRepository,
    private jwtGateway: JWTGateway,
  ) {}

  async execute(
    input: GenerateOAuthToken.Input,
  ): Promise<GenerateOAuthToken.Output> {
    const user = await this.userRepository.findOne({ id: input.userId });
    const project = await this.projectRepository.findOne({
      id: input.projectId,
    });

    if (!user || !project) {
      throw new Error('User or project not found');
    }

    const access = 'oauth';

    const authorizationCode = await this.jwtGateway.sign({
      access,
      id: user.id,
      projectId: project.id,
      projectSecret: project.secret,
      scope: project.scope,
    });

    user.addToken({ access, token: authorizationCode });

    await this.userRepository.save(user);

    return { authorizationCode };
  }
}
