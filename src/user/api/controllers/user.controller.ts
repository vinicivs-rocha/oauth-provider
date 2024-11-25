import {
  Body,
  Controller,
  Delete,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticateUserCredentials } from 'src/user/application/usecases/authenticate-user-credentials.usecase';
import { RegisterUser } from 'src/user/application/usecases/register-user.usecase';
import { RemoveToken } from 'src/user/application/usecases/remove-token.usecase';
import { User } from 'src/user/domain/entities/user';
import { Token } from '../decorators/token.decorator';
import { User as ReqUser } from '../decorators/user.decorator';
import { AuthenticationTokenGuard } from '../guards/authentication-token.guard';
import {
  AuthenticationInterceptor,
  AuthenticationResult,
} from '../interceptors/authentication.interceptor';
import { RegisterUserRequest } from '../requests/register-user.request';
import { UserCredentialsRequest } from '../requests/user-credentials.request';

@Controller('api/user')
export class UserController {
  constructor(
    private registerUser: RegisterUser,
    private authenticateUserCredentials: AuthenticateUserCredentials,
    private removeToken: RemoveToken,
  ) {}

  @Post('register')
  @UseInterceptors(AuthenticationInterceptor)
  async register(
    @Body() user: RegisterUserRequest,
  ): Promise<AuthenticationResult> {
    const result = await this.registerUser.execute(user);

    return {
      token: result.authenticationToken,
      user: result.user,
    };
  }

  @Post('login')
  @UseInterceptors(AuthenticationInterceptor)
  async login(
    @Body() credentials: UserCredentialsRequest,
  ): Promise<AuthenticationResult> {
    const result = await this.authenticateUserCredentials.execute({
      email: credentials.email,
      password: credentials.password,
    });

    return {
      token: result.token,
      user: result.user,
    };
  }

  @Delete('logout')
  @UseGuards(AuthenticationTokenGuard)
  async logout(@ReqUser() user: User, @Token() token: string) {
    await this.removeToken.execute({
      userId: user.id,
      token,
      access: 'auth',
    });

    return {
      message: 'Logged out',
    };
  }
}
