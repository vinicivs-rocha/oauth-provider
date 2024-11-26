import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from 'src/user/application/repositories/user.repository';
import { User } from 'src/user/domain/entities/user';
import { User as UserSchema } from '../schemas/user.schema';

@Injectable()
export class UserMongooseRepository implements UserRepository {
  constructor(
    @InjectModel(UserSchema.name) private userModel: Model<UserSchema>,
  ) {}

  async findOne(
    params: UserRepository.FindOneParams,
  ): Promise<User | undefined> {
    let userData: UserSchema | undefined;
    if (params.id) {
      userData = await this.userModel.findOne({ id: params.id });
    }

    return (
      userData &&
      User.create({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        password: userData.password,
        phone: userData.phone,
        createdAt: userData.createdAt,
        tokens: userData.tokens,
      })
    );
  }

  save(user: User): Promise<void> {
    return this.userModel.findOneAndUpdate(
      { id: user.id },
      {
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password,
        phone: user.phone,
        createdAt: user.createdAt,
        tokens: user.tokens,
      },
      {
        upsert: true,
        new: true,
      },
    );
  }

  async findByCredentials(
    params: UserRepository.FindByCredentialsParams,
  ): Promise<User | undefined> {
    const userData = await this.userModel.findOne({ email: params.email });

    return userData
      ? User.create({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          password: userData.password,
          phone: userData.phone,
          createdAt: userData.createdAt,
          tokens: userData.tokens,
        })
      : undefined;
  }

  async findByToken(
    params: UserRepository.FindByTokenParams,
  ): Promise<User | undefined> {
    const userData = await this.userModel.findOne({
      id: params.id,
      'tokens.token': params.token,
      'tokens.access': params.access,
    });

    return userData
      ? User.create({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          password: userData.password,
          phone: userData.phone,
          createdAt: userData.createdAt,
          tokens: userData.tokens,
        })
      : undefined;
  }
}
