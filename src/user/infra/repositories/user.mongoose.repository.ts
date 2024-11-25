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

  save(user: User): Promise<void> {
    return this.userModel.findOneAndUpdate({ id: user.id }, user, {
      upsert: true,
      new: true,
    });
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
