import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { User } from 'src/user/domain/entities/user';
import { JWTGateway } from '../gateways/jwt.gateway';

export namespace DetailCurrentUser {
  export interface Input {
    user: User;
    accessToken: string;
  }

  export interface Output {
    userData: Partial<User>;
  }
}

@Injectable()
export class DetailCurrentUser {
  constructor(private jwtGateway: JWTGateway) {}

  async execute(
    input: DetailCurrentUser.Input,
  ): Promise<DetailCurrentUser.Output> {
    const decodedToken = await this.jwtGateway.verify<{
      access: string;
      scope: string;
      id: UUID;
    }>(input.accessToken);

    return {
      userData: input.user.getScopeData(decodedToken.scope),
    };
  }
}
