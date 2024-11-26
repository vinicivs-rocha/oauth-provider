import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { ProjectController } from './api/controllers/project.controller';
import { ProjectRepository } from './application/repositories/project.repository';
import { AddProject } from './application/usecases/add-project.usecase';
import { ListProjects } from './application/usecases/list-projects.usecase';
import { RemoveProject } from './application/usecases/remove-project.usecase';
import { VerifyProject } from './application/usecases/verify-project.usecase';
import { ProjectMongooseRepository } from './infra/repositories/project.mongoose.repository';
import { Project, ProjectSchema } from './infra/schemas/project.schema';

@Module({
  imports: [
    forwardRef(() => UserModule),
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [ProjectController],
  providers: [
    ListProjects,
    AddProject,
    RemoveProject,
    { provide: ProjectRepository, useClass: ProjectMongooseRepository },
    VerifyProject,
  ],
  exports: [ListProjects, VerifyProject, ProjectRepository],
})
export class ProjectModule {}
