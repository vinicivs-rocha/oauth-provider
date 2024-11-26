import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { JWTGateway } from '../../../user/application/gateways/jwt.gateway';
import { UserRepository } from '../../../user/application/repositories/user.repository';

export namespace GenerateAccessToken {
  export interface Input {
    authorizationCode: string;
  }

  export interface Output {
    accessToken: string;
  }
}

@Injectable()
export class GenerateAccessToken {
  constructor(
    private jwtGateway: JWTGateway,
    private userRepository: UserRepository,
  ) {}

  async execute(
    input: GenerateAccessToken.Input,
  ): Promise<GenerateAccessToken.Output> {
    const decodedToken = await this.jwtGateway.verify<{
      access: string;
      id: UUID;
      projectId: UUID;
      projectSecret: string;
      scope: string;
    }>(input.authorizationCode);

    const user = await this.userRepository.findOne({ id: decodedToken.id });

    if (!user) {
      throw new Error('User not found');
    }

    const access = 'access_token';

    const accessToken = await this.jwtGateway.sign({
      access,
      scope: decodedToken.scope,
      id: user.id,
    });

    user.removeToken({ access: 'oauth', token: input.authorizationCode });

    user.addToken({ access, token: accessToken });

    await this.userRepository.save(user);

    return { accessToken };
  }
}
