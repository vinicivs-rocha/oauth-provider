import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Project } from 'src/project/domain/entities/project';
import { ProjectRepository } from '../repositories/project.repository';

export namespace VerifyProject {
  export interface Input {
    projectId?: UUID;
    scope?: string;
    redirectUrl?: string;
  }

  export interface Output {
    project: Project;
  }
}

@Injectable()
export class VerifyProject {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(input: VerifyProject.Input): Promise<VerifyProject.Output> {
    if (!input.projectId || !input.redirectUrl || !input.scope) {
      throw new Error('Missing parameters');
    }

    const project = await this.projectRepository.findOne({
      id: input.projectId,
    });

    if (!project) {
      throw new Error('Project not found');
    }

    if (!project.redirectUrls.includes(input.redirectUrl)) {
      throw new Error('Invalid redirect URL');
    }

    if (project.scope !== input.scope) {
      throw new Error('Invalid scope');
    }

    return { project };
  }
}
