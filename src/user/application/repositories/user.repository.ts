import { User } from 'src/user/domain/entities/user';

export abstract class UserRepository {
  abstract save(user: User): Promise<void>;
  abstract findByToken(
    params: UserRepository.FindByTokenParams,
  ): Promise<User | undefined>;
  abstract findByCredentials(
    params: UserRepository.FindByCredentialsParams,
  ): Promise<User | undefined>;
  abstract findOne(
    params: UserRepository.FindOneParams,
  ): Promise<User | undefined>;
}

export namespace UserRepository {
  export interface FindByTokenParams {
    token: string;
    access: string;
    id: string;
  }
  export interface FindByCredentialsParams {
    email: string;
  }

  export interface FindOneParams {
    id?: string;
  }
}
