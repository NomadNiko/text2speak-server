// src/tts/tts.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TtsController } from './tts.controller';
import { TtsService } from './tts.service';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    ConfigModule,
    FilesModule, // Import FilesModule to access FileRepository
  ],
  controllers: [TtsController],
  providers: [TtsService],
  exports: [TtsService],
})
export class TtsModule {}
