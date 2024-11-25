import { randomUUID, UUID } from 'crypto';

export type Token = { access: string; token: string };

export class User {
  constructor(
    readonly id: UUID,
    readonly name: string,
    readonly email: string,
    readonly phone: string,
    readonly password: string,
    readonly createdAt: Date,
    readonly tokens: Token[],
  ) {}

  static create(data: User.CreationData) {
    return new User(
      data.id ?? randomUUID(),
      data.name,
      data.email,
      data.phone,
      data.password,
      data.createdAt || new Date(),
      data.tokens ?? [],
    );
  }

  update(data: User.UpdatingData) {
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        this[key] = data[key];
      }
    });
  }

  addToken(token: Token) {
    this.tokens.push(token);
  }
}

export namespace User {
  export interface CreationData {
    id?: UUID;
    name: string;
    email: string;
    phone: string;
    password: string;
    createdAt?: Date;
    tokens?: Token[];
  }

  export interface UpdatingData {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    tokens?: Token[];
  }
}
