import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { ProjectRepository } from '../repositories/project.repository';

export namespace RemoveProject {
  export interface Input {
    projectId: UUID;
    deleterId: UUID;
  }

  export type Output = [];
}

@Injectable()
export class RemoveProject {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(input: RemoveProject.Input): Promise<RemoveProject.Output> {
    const project = await this.projectRepository.findOne({
      id: input.projectId,
    });

    if (!project) {
      throw new Error('Project not found');
    }

    if (project.createdBy !== input.deleterId) {
      throw new Error('You are not allowed to delete this project');
    }

    await this.projectRepository.delete(project);

    return [];
  }
}
