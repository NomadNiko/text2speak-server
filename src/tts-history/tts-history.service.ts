// src/tts-history/tts-history.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TtsHistory, TtsHistoryDocument } from './schemas/tts-history.schema';

@Injectable()
export class TtsHistoryService {
  constructor(
    @InjectModel(TtsHistory.name)
    private ttsHistoryModel: Model<TtsHistoryDocument>,
  ) {}

  async findById(id: string): Promise<TtsHistory | null> {
    return this.ttsHistoryModel.findById(id).exec();
  }

  async create(data: Partial<TtsHistory>): Promise<TtsHistory> {
    const newHistory = new this.ttsHistoryModel(data);
    return newHistory.save();
  }

  async findByUserId(userId: string): Promise<TtsHistory[]> {
    return this.ttsHistoryModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findLatest(limit: number = 10): Promise<TtsHistory[]> {
    return this.ttsHistoryModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}
