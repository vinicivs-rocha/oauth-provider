import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Project } from 'src/project/domain/entities/project';
import { ProjectRepository } from '../repositories/project.repository';

export namespace ListProjects {
  export interface Input {
    creatorId: UUID;
  }

  export interface Output {
    projects: Project[];
  }
}

@Injectable()
export class ListProjects {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(input: ListProjects.Input): Promise<ListProjects.Output> {
    const projects = await this.projectRepository.find({
      creatorId: input.creatorId,
    });

    return { projects };
  }
}
