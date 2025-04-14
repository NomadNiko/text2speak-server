// src/tts/tts.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FilesService } from '../files/files.service';
import { TtsGenerateDto, SpeedEnum } from './dto/tts-generate.dto';
import { TtsResponseDto } from './dto/tts-response.dto';

const execPromise = promisify(exec);

@Injectable()
export class TtsService {
  private readonly logger = new Logger(TtsService.name);

  // Available speakers - using speaker names as keys
  private readonly availableSpeakers = {
    p225: 'p225',
    p226: 'p226',
    p227: 'p227',
    p228: 'p228',
    p229: 'p229',
    p230: 'p230',
    p231: 'p231',
    p232: 'p232',
    p233: 'p233',
    p234: 'p234',
    p236: 'p236',
    p237: 'p237',
    p238: 'p238',
    p239: 'p239',
    p240: 'p240',
    p241: 'p241',
    p243: 'p243',
    p244: 'p244',
    p245: 'p245',
    p246: 'p246',
    p247: 'p247',
    p248: 'p248',
    p249: 'p249',
    p250: 'p250',
    p251: 'p251',
    p252: 'p252',
    p253: 'p253',
    p254: 'p254',
    p255: 'p255',
    p256: 'p256',
    p257: 'p257',
    p258: 'p258',
    p259: 'p259',
    p260: 'p260',
    p261: 'p261',
    p262: 'p262',
    p263: 'p263',
    p264: 'p264',
    p265: 'p265',
    p266: 'p266',
    p267: 'p267',
    p268: 'p268',
    p269: 'p269',
    p270: 'p270',
    p271: 'p271',
    p272: 'p272',
    p273: 'p273',
    p274: 'p274',
    p275: 'p275',
    p276: 'p276',
    p277: 'p277',
    p278: 'p278',
    p279: 'p279',
    p280: 'p280',
    p281: 'p281',
    p282: 'p282',
    p283: 'p283',
    p284: 'p284',
    p285: 'p285',
    p286: 'p286',
    p287: 'p287',
    p288: 'p288',
    p292: 'p292',
    p293: 'p293',
    p294: 'p294',
    p295: 'p295',
    p297: 'p297',
    p298: 'p298',
    p299: 'p299',
    p300: 'p300',
    p301: 'p301',
    p302: 'p302',
    p303: 'p303',
    p304: 'p304',
    p305: 'p305',
    p306: 'p306',
    p307: 'p307',
    p308: 'p308',
    p310: 'p310',
    p311: 'p311',
    p312: 'p312',
    p313: 'p313',
    p314: 'p314',
    p316: 'p316',
    p317: 'p317',
    p318: 'p318',
    p323: 'p323',
    p326: 'p326',
    p329: 'p329',
    p330: 'p330',
    p333: 'p333',
    p334: 'p334',
    p335: 'p335',
    p336: 'p336',
    p339: 'p339',
    p340: 'p340',
    p341: 'p341',
    p343: 'p343',
    p345: 'p345',
    p347: 'p347',
    p351: 'p351',
    p360: 'p360',
    p361: 'p361',
    p362: 'p362',
    p363: 'p363',
    p364: 'p364',
    p374: 'p374',
    p376: 'p376',
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly filesService: FilesService,
  ) {
    // Ensure output directory exists
    const outputDir = this.configService.get<string>(
      'TTS_OUTPUT_DIR',
      './temp_outputs',
    );
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  }

  async generateSpeech(generateDto: TtsGenerateDto): Promise<TtsResponseDto> {
    const venvPath = this.configService.get<string>(
      'TTS_VENV_PATH',
      '~/tts-env-py310',
    );
    const outputDir = this.configService.get<string>(
      'TTS_OUTPUT_DIR',
      './temp_outputs',
    );
    const defaultModel = this.configService.get<string>(
      'TTS_DEFAULT_MODEL',
      'tts_models/en/vctk/vits',
    );
    const defaultSpeaker = this.configService.get<string>(
      'TTS_DEFAULT_SPEAKER',
      'p234',
    );

    // Handle parameters
    const speaker = generateDto.speaker || defaultSpeaker;
    // Use the speaker name directly
    const speakerName = speaker;

    const model = generateDto.model || defaultModel;
    const speed = generateDto.speed || SpeedEnum.NORMAL;

    // Generate speed parameter if needed
    let speedParam = '';
    if (speed === SpeedEnum.SLOW) {
      speedParam = '--speed 0.8';
    } else if (speed === SpeedEnum.FAST) {
      speedParam = '--speed 1.2';
    }

    // Create unique filename with UUID and timestamp
    const uuid = uuidv4();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFilename = `tts_${speaker}_${speed}_${timestamp}_${uuid.slice(0, 8)}.wav`;
    const outputPath = path.join(outputDir, outputFilename);

    // Format text to prevent command injection
    const sanitizedText = generateDto.text
      .replace(/"/g, '\\"')
      .replace(/`/g, '\\`');

    // Construct the TTS command - use speaker name directly
    const ttsCommand = `source ${venvPath}/bin/activate && tts --text "${sanitizedText}" --model_name "${model}" --speaker_idx "${speakerName}" ${speedParam} --out_path "${outputPath}"`;

    this.logger.log(`Executing TTS command: ${ttsCommand}`);

    try {
      // Execute the command
      const { stdout, stderr } = await execPromise(`bash -c '${ttsCommand}'`);
      this.logger.log(`TTS generation stdout: ${stdout}`);
      if (stderr) {
        this.logger.warn(`TTS generation stderr: ${stderr}`);
      }

      // Check if file exists
      if (!fs.existsSync(outputPath)) {
        throw new Error('TTS command did not generate output file');
      }

      // Create a file entity and upload to S3 using your existing file service
      const fileData = {
        path: `tts-outputs/${outputFilename}`,
      };

      // Read the file content
      const fileContent = fs.readFileSync(outputPath);

      // Upload the file using S3
      const s3Url = await this.uploadToS3(
        outputPath,
        `tts-outputs/${outputFilename}`,
      );

      // Clean up local file
      fs.unlinkSync(outputPath);

      return {
        success: true,
        url: s3Url,
        filename: outputFilename,
        speaker,
        speed,
      };
    } catch (error) {
      this.logger.error(
        `Error generating speech: ${error.message}`,
        error.stack,
      );
      throw new Error(`Failed to generate speech: ${error.message}`);
    }
  }

  // Method to upload to S3 using your existing infrastructure
  private async uploadToS3(filePath: string, s3Key: string): Promise<string> {
    try {
      // For S3 upload in your existing structure
      const AWS = require('aws-sdk');
      const fs = require('fs');
      const s3 = new AWS.S3({
        region: this.configService.get('AWS_S3_REGION'),
        credentials: {
          accessKeyId: this.configService.get('ACCESS_KEY_ID'),
          secretAccessKey: this.configService.get('SECRET_ACCESS_KEY'),
        },
      });
      const fileContent = fs.readFileSync(filePath);
      const params = {
        Bucket: this.configService.get('AWS_DEFAULT_S3_BUCKET'),
        Key: s3Key,
        Body: fileContent,
        ContentType: 'audio/wav',
        ACL: 'public-read',
      };
      const result = await s3.upload(params).promise();
      return result.Location;
    } catch (error) {
      this.logger.error(`Error uploading to S3: ${error.message}`, error.stack);
      throw new Error(`Failed to upload to S3: ${error.message}`);
    }
  }

  async getAvailableVoices() {
    return {
      defaultSpeaker: this.configService.get<string>(
        'TTS_DEFAULT_SPEAKER',
        'p234',
      ),
      availableSpeakers: this.availableSpeakers,
    };
  }

  async checkStatus() {
    const venvPath = this.configService.get<string>(
      'TTS_VENV_PATH',
      '~/tts-env-py310',
    );
    try {
      // Check if TTS environment exists
      const checkEnvCommand = `bash -c '[ -d "${venvPath}" ] && echo "exists" || echo "not found"'`;
      const { stdout: envStatus } = await execPromise(checkEnvCommand);

      // Check if TTS command is available in the environment
      const checkTtsCommand = `bash -c 'source ${venvPath}/bin/activate && command -v tts >/dev/null 2>&1 && echo "available" || echo "not available"'`;
      const { stdout: ttsStatus } = await execPromise(checkTtsCommand);

      // Check S3 connection
      let s3Status = 'unknown';
      try {
        // Simple S3 connection test
        const AWS = require('aws-sdk');
        const s3 = new AWS.S3({
          region: this.configService.get('AWS_S3_REGION'),
          credentials: {
            accessKeyId: this.configService.get('ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('SECRET_ACCESS_KEY'),
          },
        });
        await s3.listBuckets().promise();
        s3Status = 'connected';
      } catch (s3Error) {
        s3Status = `error: ${s3Error.message}`;
      }

      return {
        status: 'ok',
        environment: {
          path: venvPath,
          status: envStatus.trim(),
        },
        tts: {
          command: 'tts',
          status: ttsStatus.trim(),
        },
        s3: {
          bucket: this.configService.get<string>('AWS_DEFAULT_S3_BUCKET'),
          status: s3Status,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error checking service status: ${error.message}`,
        error.stack,
      );
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  // Helper function to select a random speaker
  private getRandomSpeaker(): string {
    const speakerKeys = Object.keys(this.availableSpeakers);
    const randomIndex = Math.floor(Math.random() * speakerKeys.length);
    return speakerKeys[randomIndex];
  }
}
