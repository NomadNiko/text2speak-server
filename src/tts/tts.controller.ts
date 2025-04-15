// src/tts/tts.controller.ts
// Modified to include passing user ID
import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TtsService } from './tts.service';
import { TtsGenerateDto } from './dto/tts-generate.dto';
import { TtsResponseDto } from './dto/tts-response.dto';

@ApiTags('Text-to-Speech')
@Controller({
  path: 'tts',
  version: '1',
})
export class TtsController {
  constructor(private readonly ttsService: TtsService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate speech from text' })
  @ApiResponse({ status: 201, type: TtsResponseDto })
  async generateSpeech(
    @Body() generateDto: TtsGenerateDto,
    @Request() req,
  ): Promise<TtsResponseDto> {
    const userId = req.user?.id;
    return this.ttsService.generateSpeech(generateDto, userId);
  }

  @Get('voices')
  @ApiOperation({ summary: 'Get available voices' })
  async getAvailableVoices() {
    return this.ttsService.getAvailableVoices();
  }

  @Get('status')
  @ApiOperation({ summary: 'Get TTS service status' })
  async getStatus() {
    return this.ttsService.checkStatus();
  }
}
