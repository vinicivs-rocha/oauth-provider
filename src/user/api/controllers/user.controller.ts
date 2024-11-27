import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Render,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Project as ReqProject } from 'src/project/api/decorators/project.decorator';
import { ProjectVerificationGuard } from 'src/project/api/guards/project-verification.guard';
import { Project } from 'src/project/domain/entities/project';
import { AuthenticateUserCredentials } from 'src/user/application/usecases/authenticate-user-credentials.usecase';
import { DetailCurrentUser } from 'src/user/application/usecases/detail-current-user.usecase';
import { GenerateOAuthToken } from 'src/user/application/usecases/generate-oauth-token.usecase';
import { RegisterUser } from 'src/user/application/usecases/register-user.usecase';
import { RemoveToken } from 'src/user/application/usecases/remove-token.usecase';
import { User } from 'src/user/domain/entities/user';
import { Token } from '../decorators/token.decorator';
import { User as ReqUser } from '../decorators/user.decorator';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { AuthenticationTokenGuard } from '../guards/authentication-token.guard';
import { ProjectAuthorizationRequest } from '../requests/project-authorization.request';
import { RegisterUserRequest } from '../requests/register-user.request';
import { UserCredentialsRequest } from '../requests/user-credentials.request';

@Controller('/user')
export class UserController {
  constructor(
    private registerUser: RegisterUser,
    private authenticateUserCredentials: AuthenticateUserCredentials,
    private removeToken: RemoveToken,
    private generateOAuthToken: GenerateOAuthToken,
    private detailCurrentUser: DetailCurrentUser,
  ) {}

  @Get('register')
  @Render('register')
  registerScreen(
    @Query() projectAuthorizationParameters: ProjectAuthorizationRequest,
  ) {
    const areParametersMissing =
      !projectAuthorizationParameters.projectId ||
      !projectAuthorizationParameters.scope ||
      !projectAuthorizationParameters.redirectUrl;
    return {
      projectAuthorizationParameters: areParametersMissing
        ? ''
        : `?projectId=${projectAuthorizationParameters.projectId}&scope=${projectAuthorizationParameters.scope}&redirectUrl=${projectAuthorizationParameters.redirectUrl}`,
    };
  }

  @Post('register')
  async register(@Body() user: RegisterUserRequest, @Res() res: Response) {
    const result = await this.registerUser.execute(user);

    res.redirect(`/project?authenticationToken=${result.authenticationToken}`);
  }

  @Get()
  @Render('login')
  loginScreen(
    @Query() projectAuthorizationParameters: ProjectAuthorizationRequest,
  ) {
    const areParametersMissing =
      !projectAuthorizationParameters.projectId ||
      !projectAuthorizationParameters.scope ||
      !projectAuthorizationParameters.redirectUrl;
    return {
      projectAuthorizationParameters: areParametersMissing
        ? ''
        : `?projectId=${projectAuthorizationParameters.projectId}&scope=${projectAuthorizationParameters.scope}&redirectUrl=${projectAuthorizationParameters.redirectUrl}`,
    };
  }

  @Post('login')
  async login(
    @Body() credentials: UserCredentialsRequest,
    @Res() res: Response,
    @Query() projectAuthorizationParameters: ProjectAuthorizationRequest,
  ) {
    const result = await this.authenticateUserCredentials.execute({
      email: credentials.email,
      password: credentials.password,
    });

    const areParametersMissing =
      !projectAuthorizationParameters.projectId ||
      !projectAuthorizationParameters.scope ||
      !projectAuthorizationParameters.redirectUrl;

    if (!areParametersMissing) {
      res.redirect(
        `/project/consent?authenticationToken=${result.token}&projectId=${projectAuthorizationParameters.projectId}&scope=${projectAuthorizationParameters.scope}&redirectUrl=${projectAuthorizationParameters.redirectUrl}`,
      );
      return;
    }

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

  @Post('authorize-project')
  @UseGuards(AuthenticationTokenGuard, ProjectVerificationGuard)
  async authorizeProject(
    @ReqUser() user: User,
    @ReqProject() project: Project,
    @Query() projectAuthorizationParameters: ProjectAuthorizationRequest,
    @Res() res: Response,
  ) {
    const result = await this.generateOAuthToken.execute({
      projectId: project.id,
      userId: user.id,
    });

    res.redirect(
      `${projectAuthorizationParameters.redirectUrl}?code=${result.authorizationCode}`,
    );
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  me(@ReqUser() user: User, @Token() token: string) {
    return this.detailCurrentUser.execute({
      user,
      accessToken: token,
    });
  }
}
