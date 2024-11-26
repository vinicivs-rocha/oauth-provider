import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Project } from 'src/project/domain/entities/project';
import { ProjectRepository } from '../repositories/project.repository';

export namespace AddProject {
  export interface Input {
    name: string;
    redirectUrls: string[];
    scope: string;
    createdBy: UUID;
  }

  export interface Output {
    project: Project;
  }
}

@Injectable()
export class AddProject {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(input: AddProject.Input): Promise<AddProject.Output> {
    const project = Project.create({
      name: input.name,
      redirectUrls: input.redirectUrls,
      scope: input.scope,
      createdBy: input.createdBy,
    });

    const existingProjects = await this.projectRepository.find({});

    if (existingProjects.some((p) => p.name === project.name)) {
      throw new Error('Project with the same name already exists');
    }

    if (existingProjects.some((p) => p.secret === project.secret)) {
      throw new Error('Project with the same secret already exists');
    }

    if (existingProjects.some((p) => p.id === project.id)) {
      throw new Error('Project with the same id already exists');
    }

    await this.projectRepository.save(project);

    return { project };
  }
}
