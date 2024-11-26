import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';
import { Token } from 'src/user/domain/entities/user';

@Schema()
export class User {
  @Prop()
  id: UUID;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: true, unique: true, trim: true })
  phone: string;

  @Prop({ minlength: 6, required: true })
  password: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: false })
  access: string | null;

  @Prop({
    type: [
      {
        access: { type: String, required: true },
        token: { type: String, required: true },
      },
    ],
    required: true,
  })
  tokens: Token[];
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
