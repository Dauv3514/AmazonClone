import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = Document & User & { _id: Types.ObjectId };

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
