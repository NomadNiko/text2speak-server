import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { S3Service } from '../files/services/s3.service'; // Adjust import path as needed
import { TtsGenerateDto, SpeedEnum } from './dto/tts-generate.dto';
import { TtsResponseDto } from './dto/tts-response.dto';

const execPromise = promisify(exec);

@Injectable()
export class TtsService {
  private readonly logger = new Logger(TtsService.name);

  // Available speakers
  private readonly availableSpeakers = {
    p225: '1',
    p226: '2',
    p227: '3',
    p228: '4',
    p229: '5',
    p230: '6',
    p231: '7',
    p232: '8',
    p233: '9',
    p234: '10',
    p236: '11',
    p237: '12',
    p238: '13',
    p239: '14',
    p240: '15',
    p241: '16',
    p243: '17',
    p244: '18',
    p245: '19',
    p246: '20',
    // ...other speakers as in your script
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service, // Make sure this is properly injected
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
    const speakerIdx =
      this.availableSpeakers[speaker] || this.availableSpeakers[defaultSpeaker];
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

    // Construct the TTS command
    const ttsCommand = `source ${venvPath}/bin/activate && tts --text "${sanitizedText}" --model_name "${model}" --speaker_idx "${speakerIdx}" ${speedParam} --out_path "${outputPath}"`;

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

      // Upload to S3
      const s3Key = `tts-outputs/${outputFilename}`;
      const s3Url = await this.s3Service.upload(outputPath, s3Key, 'audio/wav');

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
        // Adapt this to your S3Service implementation
        await this.s3Service.testConnection();
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
