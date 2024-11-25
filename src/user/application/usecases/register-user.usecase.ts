import { Injectable } from '@nestjs/common';
import { User } from 'src/user/domain/entities/user';
import { EncryptionGateway } from '../gateways/encryption.gateway';
import { JWTGateway } from '../gateways/jwt.gateway';
import { UserRepository } from '../repositories/user.repository';

export namespace RegisterUser {
  export interface Input {
    name: string;
    email: string;
    phone: string;
    password: string;
  }

  export interface Output {
    authenticationToken: string;
    user: User;
  }
}

@Injectable()
export class RegisterUser {
  constructor(
    private userRepository: UserRepository,
    private jwtGateway: JWTGateway,
    private encryptionGateway: EncryptionGateway,
  ) {}

  async execute(input: RegisterUser.Input): Promise<RegisterUser.Output> {
    const newUser = User.create({
      email: input.email,
      name: input.name,
      phone: input.phone,
      password: await this.encryptionGateway.hash(input.password),
    });

    const token = await this.jwtGateway.sign({
      id: newUser.id,
      access: 'auth',
    });

    newUser.addToken({ token, access: 'auth' });

    await this.userRepository.save(newUser);

    return { authenticationToken: token, user: newUser };
  }
}
