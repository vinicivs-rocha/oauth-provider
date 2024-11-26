import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Render,
  UseGuards,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { RemoveProject } from 'src/project/application/usecases/remove-project.usecase';
import { Token } from 'src/user/api/decorators/token.decorator';
import { User as ReqUser } from 'src/user/api/decorators/user.decorator';
import { AuthenticationTokenGuard } from 'src/user/api/guards/authentication-token.guard';
import { User } from 'src/user/domain/entities/user';
import { AddProject } from '../../application/usecases/add-project.usecase';
import { ListProjects } from '../../application/usecases/list-projects.usecase';
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
