import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Render,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticateUserCredentials } from 'src/user/application/usecases/authenticate-user-credentials.usecase';
import { RegisterUser } from 'src/user/application/usecases/register-user.usecase';
import { RemoveToken } from 'src/user/application/usecases/remove-token.usecase';
import { User } from 'src/user/domain/entities/user';
import { Token } from '../decorators/token.decorator';
import { User as ReqUser } from '../decorators/user.decorator';
import { AuthenticationTokenGuard } from '../guards/authentication-token.guard';
import { RegisterUserRequest } from '../requests/register-user.request';
import { UserCredentialsRequest } from '../requests/user-credentials.request';

@Controller('/user')
export class UserController {
  constructor(
    private registerUser: RegisterUser,
    private authenticateUserCredentials: AuthenticateUserCredentials,
    private removeToken: RemoveToken,
  ) {}

  @Get('register')
  @Render('register')
  registerScreen() {}

  @Post('register')
  async register(@Body() user: RegisterUserRequest, @Res() res: Response) {
    const result = await this.registerUser.execute(user);

    res.redirect(`/project?authenticationToken=${result.authenticationToken}`);
  }

  @Get()
  @Render('login')
  loginScreen() {}

  @Post('login')
  async login(
    @Body() credentials: UserCredentialsRequest,
    @Res() res: Response,
  ) {
    const result = await this.authenticateUserCredentials.execute({
      email: credentials.email,
      password: credentials.password,
    });

    res.redirect(`/project?authenticationToken=${result.token}`);
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
