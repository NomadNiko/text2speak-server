import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileRepository } from '../files/infrastructure/persistence/file.repository';
import { TtsGenerateDto, SpeedEnum } from './dto/tts-generate.dto';
import { TtsResponseDto } from './dto/tts-response.dto';
import { getVoiceMap, getDefaultVoiceId, voices } from './config/voices.config';

const execPromise = promisify(exec);

@Injectable()
export class TtsService {
  private readonly logger = new Logger(TtsService.name);
  // Voices are now loaded from the config file
  private readonly availableSpeakers: Record<string, string>;
  private readonly defaultSpeaker: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly fileRepository: FileRepository,
  ) {
    // Ensure output directory exists
    const outputDir = this.configService.get<string>(
      'TTS_OUTPUT_DIR',
      './temp_outputs',
    );
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Load voice data from configuration
    this.availableSpeakers = getVoiceMap();
    this.defaultSpeaker = this.configService.get<string>(
      'TTS_DEFAULT_SPEAKER',
      getDefaultVoiceId(),
    );
  }

  /**
   * Properly escapes a string for use in shell commands
   * This handles quotes, apostrophes, and other special characters
   */
  private escapeShellArg(arg: string): string {
    // Replace all single quotes with the sequence: '"'"'
    // This works by ending the current single-quoted string,
    // adding a double-quoted single quote, and starting a new single-quoted string
    return `'${arg.replace(/'/g, "'\\''")}'`;
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

    // Handle parameters
    const speaker = generateDto.speaker || this.defaultSpeaker;
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
    const tempOutputPath = path.join(outputDir, outputFilename);

    // Properly escape the text for shell command
    const escapedText = this.escapeShellArg(generateDto.text);

    // Construct the TTS command with properly escaped arguments
    const ttsCommand = `source ${venvPath}/bin/activate && tts --text ${escapedText} --model_name "${model}" --speaker_idx "${speaker}" ${speedParam} --out_path "${tempOutputPath}"`;

    this.logger.log(`Executing TTS command: ${ttsCommand}`);
    try {
      // Execute the command
      const { stdout, stderr } = await execPromise(`bash -c '${ttsCommand}'`);
      this.logger.log(`TTS generation stdout: ${stdout}`);
      if (stderr) {
        this.logger.warn(`TTS generation stderr: ${stderr}`);
      }

      // Check if file exists
      if (!fs.existsSync(tempOutputPath)) {
        throw new Error('TTS command did not generate output file');
      }

      // Create file entity directly using the repository
      // CHANGE: Store just the filename as the path
      const filePath = `/${outputFilename}`;

      // Move file to the files directory
      const filesDir = path.join(process.cwd(), 'files');
      if (!fs.existsSync(filesDir)) {
        fs.mkdirSync(filesDir, { recursive: true });
      }
      fs.copyFileSync(tempOutputPath, path.join(filesDir, outputFilename));

      // Create the file record in the database
      const file = await this.fileRepository.create({
        path: filePath,
      });

      // Clean up temp file
      fs.unlinkSync(tempOutputPath);

      // Construct the final URL
      const backendDomain = this.configService.get(
        'BACKEND_DOMAIN',
        'https://t2s.menutraining.com',
      );
      const fullUrl = `${backendDomain}/api/v1/files/${outputFilename}`;

      return {
        success: true,
        url: fullUrl,
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
    // Return structured voice data with additional metadata
    return {
      defaultSpeaker: this.defaultSpeaker,
      availableSpeakers: this.availableSpeakers,
      voiceDetails: voices, // Include the complete voice details for the frontend
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
}
