import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Project {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, unique: true })
  secret: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, type: [String] })
  redirectUrls: string[];

  @Prop({ enum: ['default', 'email', 'phone', 'full'], default: 'default' })
  scope: string;

  @Prop({ required: true })
  createdBy: UUID;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type ProjectDocument = HydratedDocument<Project>;

export const ProjectSchema = SchemaFactory.createForClass(Project);
