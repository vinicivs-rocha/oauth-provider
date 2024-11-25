import { Injectable } from '@nestjs/common';
import { User } from 'src/user/domain/entities/user';
import { EncryptionGateway } from '../gateways/encryption.gateway';
import { JWTGateway } from '../gateways/jwt.gateway';
import { UserRepository } from '../repositories/user.repository';

export namespace AuthenticateUserCredentials {
  export interface Input {
    email: string;
    password: string;
  }

  export interface Output {
    user: User;
    token: string;
  }
}

@Injectable()
export class AuthenticateUserCredentials {
  constructor(
    private userRepository: UserRepository,
    private encryptionGateway: EncryptionGateway,
    private jwtGateway: JWTGateway,
  ) {}

  async execute(
    input: AuthenticateUserCredentials.Input,
  ): Promise<AuthenticateUserCredentials.Output> {
    const user = await this.userRepository.findByCredentials({
      email: input.email,
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await this.encryptionGateway.compare({
      plain: input.password,
      encrypted: user.password,
    });

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const authenticationToken = await this.jwtGateway.sign({
      id: user.id,
      access: 'auth',
    });

    user.addToken({ token: authenticationToken, access: 'auth' });

    await this.userRepository.save(user);

    return { token: authenticationToken, user };
  }
}
