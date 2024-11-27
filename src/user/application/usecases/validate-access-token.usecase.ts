import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { User } from 'src/user/domain/entities/user';
import { JWTGateway } from '../gateways/jwt.gateway';
import { UserRepository } from '../repositories/user.repository';

export namespace ValidateAccessToken {
  export interface Input {
    token?: string;
  }

  export interface Output {
    user: User;
  }
}

@Injectable()
export class ValidateAccessToken {
  constructor(
    private userRepository: UserRepository,
    private jwtGateway: JWTGateway,
  ) {}

  async execute(
    input: ValidateAccessToken.Input,
  ): Promise<ValidateAccessToken.Output> {
    if (!input.token) {
      throw new Error('Token not provided');
    }

    const decodedToken = await this.jwtGateway.verify<{
      access: string;
      scope: string;
      id: UUID;
    }>(input.token);

    const user = await this.userRepository.findByToken({
      id: decodedToken.id,
      token: input.token,
      access: 'access_token',
    });

    if (!user) {
      throw new Error('Invalid access token');
    }

    return { user };
  }
}
