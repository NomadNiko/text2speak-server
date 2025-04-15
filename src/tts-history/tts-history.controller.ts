// src/tts-history/tts-history.controller.ts
import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TtsHistoryService } from './tts-history.service';
import { TtsHistory } from './schemas/tts-history.schema';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('TTS History')
@Controller({
  path: 'tts-history',
  version: '1',
})
export class TtsHistoryController {
  constructor(private readonly ttsHistoryService: TtsHistoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get TTS history for the current user' })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getUserHistory(@Request() req): Promise<TtsHistory[]> {
    return this.ttsHistoryService.findByUserId(req.user.id);
  }

  @Get('latest')
  @ApiOperation({ summary: 'Get latest TTS generations' })
  @ApiResponse({ status: 200 })
  async getLatestHistory(
    @Query('limit') limit: number = 10,
  ): Promise<TtsHistory[]> {
    return this.ttsHistoryService.findLatest(Number(limit) || 10);
  }
}
