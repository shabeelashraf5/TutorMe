import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import mongoose, { Document } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { User } from 'src/modules/users/schemas/user.schema';

@Schema()
export class Folder extends Document {
  @Prop({ type: String, isRequired: true })
  title: string;

  @Prop({ type: String, isRequired: true })
  class: string;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  // userid: User;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);
