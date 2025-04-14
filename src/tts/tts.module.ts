import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TtsController } from './tts.controller';
import { TtsService } from './tts.service';
import { FilesModule } from '../files/files.module'; // Adjust import path as needed

@Module({
  imports: [
    ConfigModule,
    FilesModule, // Make sure this module exports S3Service
  ],
  controllers: [TtsController],
  providers: [TtsService],
  exports: [TtsService],
})
export class TtsModule {}
