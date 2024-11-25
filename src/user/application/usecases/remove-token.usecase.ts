import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

export namespace RemoveToken {
  export interface Input {
    userId: string;
    token: string;
    access: string;
  }

  export type Output = [];
}

@Injectable()
export class RemoveToken {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: RemoveToken.Input): Promise<RemoveToken.Output> {
    const user = await this.userRepository.findByToken({
      id: input.userId,
      token: input.token,
      access: input.access,
    });

    if (!user) {
      throw new Error('User not found');
    }

    console.log(user);

    user.update({
      tokens: user.tokens.filter((t) => t.token !== input.token),
    });

    await this.userRepository.save(user);

    return [];
  }
}
