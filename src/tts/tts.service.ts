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
    p247: '21',
    p248: '22',
    p249: '23',
    p250: '24',
    p251: '25',
    p252: '26',
    p253: '27',
    p254: '28',
    p255: '29',
    p256: '30',
    p257: '31',
    p258: '32',
    p259: '33',
    p260: '34',
    p261: '35',
    p262: '36',
    p263: '37',
    p264: '38',
    p265: '39',
    p266: '40',
    p267: '41',
    p268: '42',
    p269: '43',
    p270: '44',
    p271: '45',
    p272: '46',
    p273: '47',
    p274: '48',
    p275: '49',
    p276: '50',
    p277: '51',
    p278: '52',
    p279: '53',
    p280: '54',
    p281: '55',
    p282: '56',
    p283: '57',
    p284: '58',
    p285: '59',
    p286: '60',
    p287: '61',
    p288: '62',
    p292: '63',
    p293: '64',
    p294: '65',
    p295: '66',
    p297: '67',
    p298: '68',
    p299: '69',
    p300: '70',
    p301: '71',
    p302: '72',
    p303: '73',
    p304: '74',
    p305: '75',
    p306: '76',
    p307: '77',
    p308: '78',
    p310: '79',
    p311: '80',
    p312: '81',
    p313: '82',
    p314: '83',
    p316: '84',
    p317: '85',
    p318: '86',
    p323: '87',
    p326: '88',
    p329: '89',
    p330: '90',
    p333: '91',
    p334: '92',
    p335: '93',
    p336: '94',
    p339: '95',
    p340: '96',
    p341: '97',
    p343: '98',
    p345: '99',
    p347: '100',
    p351: '101',
    p360: '102',
    p361: '103',
    p362: '104',
    p363: '105',
    p364: '106',
    p374: '107',
    p376: '108',
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

      // Create a file entity and upload to S3 using your existing file service
      const fileData = {
        path: `tts-outputs/${outputFilename}`,
      };

      // Read the file content
      const fileContent = fs.readFileSync(outputPath);

      // Upload the file using S3 (we'll need to implement this method)
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
    // Implement file upload to S3
    // This will depend on your existing file handling infrastructure

    // Example implementation - you'll need to adjust this based on your actual FilesService implementation
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
