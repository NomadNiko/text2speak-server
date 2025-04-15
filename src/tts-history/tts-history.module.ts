// src/tts-history/tts-history.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TtsHistoryController } from './tts-history.controller';
import { TtsHistoryService } from './tts-history.service';
import { TtsHistory, TtsHistorySchema } from './schemas/tts-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TtsHistory.name, schema: TtsHistorySchema },
    ]),
  ],
  controllers: [TtsHistoryController],
  providers: [TtsHistoryService],
  exports: [TtsHistoryService],
})
export class TtsHistoryModule {}
