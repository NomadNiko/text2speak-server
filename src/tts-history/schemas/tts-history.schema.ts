// src/tts-history/schemas/tts-history.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TtsHistoryDocument = HydratedDocument<TtsHistory>;

@Schema({ timestamps: true })
export class TtsHistory {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  speaker: string;

  @Prop({ required: true })
  speed: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
  userId?: string;
}

export const TtsHistorySchema = SchemaFactory.createForClass(TtsHistory);
