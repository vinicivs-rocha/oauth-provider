import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectRepository } from 'src/project/application/repositories/project.repository';
import { Project } from 'src/project/domain/entities/project';
import { Project as ProjectSchema } from '../schemas/project.schema';

@Injectable()
export class ProjectMongooseRepository implements ProjectRepository {
  constructor(
    @InjectModel(ProjectSchema.name) private userModel: Model<ProjectSchema>,
  ) {}
  save(project: Project): Promise<void> {
    return this.userModel.findOneAndUpdate({ id: project.id }, project, {
      upsert: true,
      new: true,
    });
  }

  async find(params: ProjectRepository.FindingParams): Promise<Project[]> {
    const projects = await this.userModel.find({
      createdBy: params.creatorId,
    });

    return projects.map((p) =>
      Project.create({
        id: p.id,
        name: p.name,
        redirectUrls: p.redirectUrls,
        scope: p.scope,
        secret: p.secret,
        createdBy: p.createdBy,
        createdAt: p.createdAt,
      }),
    );
  }

  async findOne(
    params: ProjectRepository.FindingOneParams,
  ): Promise<Project | undefined> {
    const projectData = await this.userModel.findOne({ id: params.id });

    return projectData
      ? Project.create({
          id: projectData.id,
          name: projectData.name,
          redirectUrls: projectData.redirectUrls,
          scope: projectData.scope,
          secret: projectData.secret,
          createdBy: projectData.createdBy,
          createdAt: projectData.createdAt,
        })
      : undefined;
  }

  delete(project: Project): Promise<void> {
    return this.userModel.findOneAndDelete({ id: project.id });
  }
}
