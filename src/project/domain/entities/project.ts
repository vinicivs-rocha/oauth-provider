import { createHmac, randomUUID, UUID } from 'crypto';

export class Project {
  constructor(
    readonly id: UUID,
    readonly name: string,
    readonly secret: string,
    readonly redirectUrls: string[],
    readonly scope: string,
    readonly createdBy: UUID,
    readonly createdAt: Date,
  ) {}

  static create(data: Project.CreationData): Project {
    const projectId = data.id ?? randomUUID();
    return new Project(
      projectId,
      data.name,
      data.secret ??
        createHmac('sha256', process.env.PROJECT_SECRET_KEY)
          .update(projectId)
          .digest('hex'),
      data.redirectUrls ?? [],
      data.scope,
      data.createdBy,
      data.createdAt ?? new Date(),
    );
  }
}

export namespace Project {
  export interface CreationData {
    id?: UUID;
    name: string;
    secret?: string;
    redirectUrls?: string[];
    scope: string;
    createdBy: UUID;
    createdAt?: Date;
  }
}
