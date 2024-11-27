import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Render,
  UseGuards,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { RemoveProject } from 'src/project/application/usecases/remove-project.usecase';
import { Project } from 'src/project/domain/entities/project';
import { Token } from 'src/user/api/decorators/token.decorator';
import { User as ReqUser } from 'src/user/api/decorators/user.decorator';
import { AuthenticationTokenGuard } from 'src/user/api/guards/authentication-token.guard';
import { ProjectAuthorizationRequest } from 'src/user/api/requests/project-authorization.request';
import { User } from 'src/user/domain/entities/user';
import { AddProject } from '../../application/usecases/add-project.usecase';
import { ListProjects } from '../../application/usecases/list-projects.usecase';
import { Project as ReqProject } from '../decorators/project.decorator';
import { ProjectVerificationGuard } from '../guards/project-verification.guard';
import { AddProjectRequest } from '../requests/add-project.request';

@Controller('project')
export class ProjectController {
  constructor(
    private listProjects: ListProjects,
    private addProject: AddProject,
    private removeProject: RemoveProject,
  ) {}

  private scopes = [
    { value: 'default', label: 'Default' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'full', label: 'Full (default, email and phone)' },
  ];

  private scopeAccess = {
    full: [
      'Identificador único do usuário',
      'Nome do usuário',
      'E-mail do usuário',
      'Número de telefone do usuário',
    ],
    default: ['Identificador único do usuário', 'Nome do usuário'],
    email: [
      'Identificador único do usuário',
      'Nome do usuário',
      'E-mail do usuário',
    ],
    phone: [
      'Identificador único do usuário',
      'Nome do usuário',
      'Número de telefone do usuário',
    ],
  };

  private async getProjects(user: User) {
    const result = await this.listProjects.execute({ creatorId: user.id });
    return result.projects;
  }

  @Get()
  @Render('projects')
  @UseGuards(AuthenticationTokenGuard)
  async list(@ReqUser() user: User, @Token() authenticationToken: string) {
    return {
      projects: await this.getProjects(user),
      authenticationToken,
      scopes: this.scopes,
    };
  }

  @Get('/consent')
  @Render('consent')
  @UseGuards(AuthenticationTokenGuard, ProjectVerificationGuard)
  async consent(
    @ReqUser() user: User,
    @Token() authenticationToken: string,
    @ReqProject() project: Project,
    @Query() projectAuthorizationParameters: ProjectAuthorizationRequest,
  ) {
    return {
      authenticationToken,
      projectId: projectAuthorizationParameters.projectId,
      projectScope: projectAuthorizationParameters.scope,
      projectRedirectUrl: projectAuthorizationParameters.redirectUrl,
      project,
      scopeAccess: this.scopeAccess[project.scope],
    };
  }

  @Post()
  @Render('projects')
  @UseGuards(AuthenticationTokenGuard)
  async add(
    @ReqUser() user: User,
    @Token() authenticationToken: string,
    @Body() project: AddProjectRequest,
  ) {
    await this.addProject.execute({
      createdBy: user.id,
      name: project.name,
      redirectUrls: [project.redirectUrl],
      scope: project.scope,
    });

    return {
      projects: await this.getProjects(user),
      authenticationToken,
      scopes: this.scopes,
    };
  }

  @Delete(':id')
  @Render('projects')
  @UseGuards(AuthenticationTokenGuard)
  async remove(
    @ReqUser() user: User,
    @Token() authenticationToken: string,
    @Param('id') id: UUID,
  ) {
    await this.removeProject.execute({ projectId: id, deleterId: user.id });
    return {
      projects: await this.getProjects(user),
      authenticationToken,
      scopes: this.scopes,
    };
  }
}
