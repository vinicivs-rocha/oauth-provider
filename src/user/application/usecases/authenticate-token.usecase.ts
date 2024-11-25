import { Injectable } from '@nestjs/common';
import { User } from 'src/user/domain/entities/user';
import { JWTGateway } from '../gateways/jwt.gateway';
import { UserRepository } from '../repositories/user.repository';

export namespace AuthenticateToken {
  export interface Input {
    token?: string;
  }

  export type Output = {
    user: User;
  };
}

@Injectable()
export class AuthenticateToken {
  constructor(
    private userRepository: UserRepository,
    private jwtGateway: JWTGateway,
  ) {}

  async execute(
    input: AuthenticateToken.Input,
  ): Promise<AuthenticateToken.Output> {
    if (!input.token) {
      throw new Error('Token not provided');
    }

    const decodedToken = await this.jwtGateway.verify<{
      id: string;
      access: string;
    }>(input.token);

    const user = await this.userRepository.findByToken({
      id: decodedToken.id,
      token: input.token,
      access: decodedToken.access,
    });

    if (!user) {
      throw new Error('User not found');
    }

    return { user };
  }
}
