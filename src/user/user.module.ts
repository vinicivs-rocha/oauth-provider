import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectModule } from 'src/project/project.module';
import { UserController } from './api/controllers/user.controller';
import { EncryptionGateway } from './application/gateways/encryption.gateway';
import { JWTGateway } from './application/gateways/jwt.gateway';
import { UserRepository } from './application/repositories/user.repository';
import { AuthenticateUserCredentials } from './application/usecases/authenticate-user-credentials.usecase';
import { DetailCurrentUser } from './application/usecases/detail-current-user.usecase';
import { GenerateOAuthToken } from './application/usecases/generate-oauth-token.usecase';
import { RegisterUser } from './application/usecases/register-user.usecase';
import { RemoveToken } from './application/usecases/remove-token.usecase';
import { ValidateAuthenticationToken } from './application/usecases/valdiate-authentication-token.usecase';
import { ValidateAccessToken } from './application/usecases/validate-access-token.usecase';
import { ValidateAuthorizationCode } from './application/usecases/validate-authorization-code.usecase';
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
    forwardRef(() => ProjectModule),
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
      provide: ValidateAuthenticationToken,
      useClass: ValidateAuthenticationToken,
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
    ValidateAuthorizationCode,
    GenerateOAuthToken,
    ValidateAccessToken,
    DetailCurrentUser,
  ],
  controllers: [UserController],
  exports: [
    ValidateAuthenticationToken,
    UserRepository,
    ValidateAuthorizationCode,
    JWTGateway,
  ],
})
export class UserModule {}
