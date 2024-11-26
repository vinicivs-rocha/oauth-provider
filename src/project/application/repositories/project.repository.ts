import { UUID } from 'crypto';
import { Project } from 'src/project/domain/entities/project';

export abstract class ProjectRepository {
  abstract save(project: Project): Promise<void>;
  abstract find(params: ProjectRepository.FindingParams): Promise<Project[]>;
  abstract findOne(
    params: ProjectRepository.FindingOneParams,
  ): Promise<Project | undefined>;
  abstract delete(project: Project): Promise<void>;
}

export namespace ProjectRepository {
  export interface FindingParams {
    creatorId?: UUID;
  }

  export interface FindingOneParams {
    id: UUID;
  }
}
