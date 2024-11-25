import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './api/controllers/user.controller';
import { EncryptionGateway } from './application/gateways/encryption.gateway';
import { JWTGateway } from './application/gateways/jwt.gateway';
import { UserRepository } from './application/repositories/user.repository';
import { AuthenticateToken } from './application/usecases/authenticate-token.usecase';
import { AuthenticateUserCredentials } from './application/usecases/authenticate-user-credentials.usecase';
import { RegisterUser } from './application/usecases/register-user.usecase';
import { RemoveToken } from './application/usecases/remove-token.usecase';
import { EncryptionArgonGateway } from './infra/gateways/encryption.argon.gateway';
import { JWTNestGateway } from './infra/gateways/jwt.nest.gateway';
import { UserMongooseRepository } from './infra/repositories/user.mongoose.repository';
import { User, UserSchema } from './infra/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: UserMongooseRepository,
    },
    {
      provide: JWTGateway,
      useClass: JWTNestGateway,
    },
    {
      provide: EncryptionGateway,
      useClass: EncryptionArgonGateway,
    },
    {
      provide: AuthenticateToken,
      useClass: AuthenticateToken,
    },
    {
      provide: AuthenticateUserCredentials,
      useClass: AuthenticateUserCredentials,
    },
    {
      provide: RegisterUser,
      useClass: RegisterUser,
    },
    {
      provide: RemoveToken,
      useClass: RemoveToken,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
