// src/tts/tts.module.ts
// Modified to include TtsHistoryModule
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TtsController } from './tts.controller';
import { TtsService } from './tts.service';
import { FilesModule } from '../files/files.module';
import { TtsHistoryModule } from '../tts-history/tts-history.module';

@Module({
  imports: [ConfigModule, FilesModule, TtsHistoryModule],
  controllers: [TtsController],
  providers: [TtsService],
  exports: [TtsService],
})
export class TtsModule {}
